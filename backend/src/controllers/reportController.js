import { MongoClient, GridFSBucket } from 'mongodb';

const mongoURI = 'mongodb://localhost:27017/HealthBridge';

export const uploadReport = (req, res) => {
  console.log("file is ",req.file);
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
      .toArray();
    res.json(files);
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
