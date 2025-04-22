import express from "express"
import { fileURLToPath } from 'url';
import path from "path"
import dotenv from "dotenv";
import cors from "cors";

import cookieParser from "cookie-parser";
import errorMiddleware from "./src/middlewares/errors.js";

import { connectDatabase } from "./config/dbConnect.js";
import Razorpay from 'razorpay';



//import { cardsData } from "./src/constants.js";
dotenv.config({ path: "./config/config.env" });
const app = express()
const port = process.env.PORT||3000
connectDatabase();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
  origin: 'http://localhost:5173', // allow frontend origin
  credentials: true,               // allow cookies if needed
}));

app.use(express.json());
app.use(cookieParser());



app.use('/photos', express.static(path.join(__dirname, 'photos')));

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/doctor',doctorRoutes);
app.use('/api/doctors',doctors);


app.get('/api/cards',(req,res)=>{
   const cardsData=[
    {
      id:1,
      photoUrl:"http://localhost:5000/photos/onco.jpg",
      title:"Oncologist",
      description:"Specializes in diagnosing and treating cancer, offering treatments like chemotherapy, radiation, and immunotherapy to help patients fight the disease."
    },
    {
      id:2,
      photoUrl:"http://localhost:5000/photos/neuro.jpg",
      title:"Neurologist",
      description:"Focuses on disorders of the nervous system, including the brain, spinal cord, and nerves, treating conditions like epilepsy, migraines, and strokes."
    },
    {
      id:3,
      photoUrl:"http://localhost:5000/photos/cardio.jpg",
      title:"Cardiologist",
      description:"Expert in diagnosing and treating heart-related conditions such as hypertension, heart attacks, arrhythmias, and congenital heart diseases."
    },
    {
      id:4,
      photoUrl:"http://localhost:5000/photos/physician.jpg",
      title:"Physician",
      description:"A general medical practitioner who provides comprehensive healthcare, diagnosing and managing a wide range of medical conditions."
    },
    {
      id:5,
      photoUrl:"http://localhost:5000/photos/dentist.jpg",
      title:"Dentist",
      description:"Specializes in oral health, treating issues related to teeth, gums, and the overall health of the mouth, including preventive care and surgery."
    },
    {
      id:6,
      photoUrl:"http://localhost:5000/photos/child.jpg",
      title:"Child Specialist",
      description:"Dedicated to the healthcare of infants, children, and adolescents, providing vaccinations, growth monitoring, and treatment for childhood illnesses."
    },
    {
      id:7,
      photoUrl:"http://localhost:5000/photos/istockphoto-1226381047-612x612.jpg",
      title:"Dermatologist",
      description:"A skin care expert who diagnoses and treats skin conditions, hair loss, acne, eczema, and other dermatological issues."
    },
    {
      id:8,
      photoUrl:"http://localhost:5000/photos/radio.jpg",
      title:"Radiologist",
      description:"Uses imaging technologies like X-rays, MRIs, and CT scans to diagnose and guide treatment for various medical conditions."
    },
    {
      id:9,
      photoUrl:"http://localhost:5000/photos/gastro.jpg",
      title:"Gastroenterologist",
      description:"Specializes in diseases of the digestive system, treating conditions like acid reflux, irritable bowel syndrome, and liver diseases."
    },
    {
      id:10,
      photoUrl:"http://localhost:5000/photos/endocrine.jpg",
      title:"Endocrinologist",
      description:"Deals with hormonal imbalances and gland-related disorders such as diabetes, thyroid issues, and adrenal diseases."
    },
    {
      id:11,
      photoUrl:"http://localhost:5000/photos/istockphoto-1369683259-612x612.jpg",
      title:"Psychiatrist",
      description:"Focuses on mental health, diagnosing and treating conditions like depression, anxiety, bipolar disorder, and schizophrenia."
    },
    {
      id:12,
      photoUrl:"http://localhost:5000/photos/istockphoto-1226381047-612x612.jpg",
      title:"Geriatrician",
      description:"Provides specialized care for older adults, addressing age-related medical issues such as dementia, arthritis, and frailty."
    },
    {
      id:13,
      photoUrl:"http://localhost:5000/photos/24214-nephrologist.jpg",
      title:"Nephrologist",
      description:"Treats kidney-related diseases, including chronic kidney disease, kidney stones, and conditions requiring dialysis."
    },
    {
      id:14,
      photoUrl:"http://localhost:5000/photos/istockphoto-1366650119-612x612.jpg",
      title:"Orthopaedist",
      description:"Specializes in the musculoskeletal system, treating bone fractures, joint issues, and sports injuries through surgical and non-surgical methods."
    },
    {
      id:15,
      photoUrl:"http://localhost:5000/photos/allergy.jpg",
      title:"Allergist",
      description:"Treats allergies, asthma, and immune system disorders, providing testing and management for reactions to allergens like pollen and food."
    },
    {
      id:16,
      photoUrl:"http://localhost:5000/photos/hemato.jpg",
      title:"Hematologists",
      description:"Focuses on blood-related conditions such as anemia, clotting disorders, leukemia, and lymphoma."
    },
    {
      id:17,
      photoUrl:"http://localhost:5000/photos/internist.jpg",
      title:"Internists",
      description:"A specialist in adult medicine who manages complex and chronic illnesses like hypertension, diabetes, and heart disease."
    },
    {
      id:18,
      photoUrl:"http://localhost:5000/photos/gyna.jpg",
      title:"Gynaecologist",
      description:"Focuses on women's reproductive health, including pregnancy, menstrual issues, hormonal disorders, and gynecological surgeries."
    },
    {
      id:19,
      photoUrl:"http://localhost:5000/photos/optha.jpg",
      title:"Ophthalmologists",
      description:"An eye specialist who treats vision problems, cataracts, glaucoma, and other eye-related conditions, often performing surgeries."
    },
    {
      id:20,
      photoUrl:"http://localhost:5000/photos/anesth.jpg",
      title:"Anesthesiologist",
      description:"Responsible for administering anesthesia and managing pain during and after surgeries or medical procedures."
    },
    {
      id:21,
      photoUrl:"http://localhost:5000/photos/pulmo.jpg",
      title:"Pulmonologist",
      description:"Treats lung and respiratory disorders, including asthma, chronic obstructive pulmonary disease (COPD), and lung infections."
    },

  ]
  res.send(cardsData);
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Import all routes
import userAuthRoutes from "./src/routes/userAuth.js"
import doctorRoutes from "./src/routes/doctorRoutes.js"
import doctors from "./src/routes/Doctors.js";
import reportRoutes from './src/routes/reportRoutes.js';
import PaymentRoutes from "./src/routes/paymentRoutes.js"
import adminRoutes from "./src/routes/adminRoutes.js"

import chatRoutes from "./src/routes/chatRoutes.js"
import messageRoutes from "./src/routes/messageRoutes.js"

app.use("/api",userAuthRoutes);

app.use('/api/doctor',doctorRoutes);
app.use('/api/doctors',doctors);
app.use('/api/reports', reportRoutes);
<<<<<<< HEAD
app.use('/api/payment', PaymentRoutes);
app.use('/api/admin', adminRoutes);
app.get("/api/getkey",(req,res)=>{
  res.status(200).json({ key: "rzp_test_zO7al582cFueyW" })
})
=======

app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
>>>>>>> 2e26a8f5f0791e07758624cf28112fffd6e16112
// Using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

//Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});

// Backend: Socket setup (socketServer.js)
import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true
  }
});


io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("setup", (user) => {
      socket.join(user._id);
      console.log("Room created for user:", user._id);
      socket.emit("connected");
  });

  socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined chat room:", room);

  });

  socket.on("new message", (newMessageRecieved) => {
    // console.log("new message came")
    // console.log(newMessageRecieved);
      const chat = newMessageRecieved.chat;

      if (!chat?.users) return console.log("chat.users not defined");

      chat.users.forEach((user) => {
        // console.log(user)
          if (`${user.userId}` === `${newMessageRecieved.sender._id}`) return;

          socket.to(user.userId).emit("message recieved", newMessageRecieved);
      });
  });
  socket.on("delete chat", (data) => {
    // console.log("new message came")
    // console.log(newMessageRecieved);
      // const chat = newMessageRecieved.chat;
      console.log();
      const userid=data.user[0]._id;
      const chatid=data.chatid;
      // console.log(userid);
      if (!userid) return console.log("id not defined");

      // chat.users.forEach((user) => {
      //   console.log(user)
      //     if (`${user.userId}` === `${newMessageRecieved.sender._id}`) return;

          socket.to(userid).emit("end chat",chatid);
      // });
  });
});

  