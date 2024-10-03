const express = require("express");
const bcrypt = require('bcrypt');
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { z } = require('zod')

mongoose.connect("")

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        email : z.string().min(5).max(50).email(),
        name : z.string().min(1).max(50),
        password : z.string().min(8).max(20)
    })

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    if(!parsedDataWithSuccess){
        res.json({
            message: "Incorrect Credentials"
        })
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    
   
      const hashedPassword = await bcrypt.hash(password, 5);
  
      await UserModel.create({
        email,
        password: hashedPassword,
        name,
      });
    
      res.json({
        message: "User already exist",
      });
      
   
  
    if(!errorThrown){
      res.json({
        message: "You are signed in",
      });
    }
  
  
  });
  
  app.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const response = await UserModel.findOne({
      email: email,
    });
  
    if (!user) {
      res.json({
        message: "User does not exist",
      });
    }
  
    const matchPassword = await bcrypt.compare(password, response.password);
  
    if (matchPassword) {
      const token = jwt.sign(
        {
          id: response._id.toString(),
        },
        JWT_SECRET
      );
      res.json({
        token,
      });
    } else {
      res.status(403).json({
        message: "Wrong Credentials",
      });
    }
  });
  
  app.post("/todo", auth, async (req, res) => {
    const done = req.body.done;
    const title = req.body.title;
    const userId = req.userId;
  
    await TodoModel.create({
      userId,
      title,
      done,
    });
    res.json({
      message: "Todo Created",
    });
  });
  
  app.get("/todos", auth, async (req, res) => {
    const userId = req.userId;
    await TodoModel.find({
      userId,
    });
    res.json({
      userId,
    });
  });
  
  


app.listen(3000);