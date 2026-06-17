import { MongoClient, GridFSBucket } from 'mongodb';
import { getMongoURI } from '../../config/dbConnect.js';
import { Doctor } from '../models/doctorModel.js';

const mongoURI = getMongoURI();

export const uploadReport = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  res.status(200).json({
    message: 'File uploaded successfully',
    fileId: req.file.id,
    filename: req.file.filename,
  });
};

export const getReportsByPatient = async (req, res) => {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    const db = client.db();
    const files = await db
      .collection('reports.files')
      .find({ 'metadata.patientId': req.params.id })
      .sort({ uploadDate: -1 })
      .toArray();

    // Enrich each report with the uploading doctor's name so the patient sees
    // who shared it (metadata only stores the doctorId).
    const doctorIds = [...new Set(files.map((f) => f.metadata?.doctorId).filter(Boolean))];
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select('name').lean();
    const nameById = Object.fromEntries(doctors.map((d) => [String(d._id), d.name]));

    const enriched = files.map((f) => ({
      ...f,
      metadata: {
        ...f.metadata,
        doctorName: nameById[String(f.metadata?.doctorId)] || null,
      },
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  } finally {
    await client.close();
  }
};

export const downloadReport = async (req, res) => {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'reports' });

    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
    downloadStream.on('error', () => res.status(404).send('File not found'));
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading file', error });
  }
};
