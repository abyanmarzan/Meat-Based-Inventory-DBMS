import express from 'express';
import { connectionToDatabase } from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const db = await connectionToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashPassword]
        );

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectionToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not existed" });
        }

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = jwt.sign({ id: rows[0].id }, process.env.JWT_KEY, { expiresIn: '3h' });

        res.status(201).json({ token: token });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Token verification middleware
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "No Token Provided" });
        }
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.userID = decode.id;
        next();
    } catch (err) {
        return res.status(500).json({ message: "server error" });
    }
};

// Home route (get user info)
router.get('/home', verifyToken, async (req, res) => {
    try {
        const db = await connectionToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.userID]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not existed" });
        }
        return res.status(201).json({ user: rows[0] });
    } catch (err) {
        return res.status(500).json({ message: "server error" });
    }
});


// CREATE
router.post('/adduser', async (req, res) => {
  const { name, email } = req.body;
  try {
    const db = await connectionToDatabase();
    await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// READ
router.get('/allusers', async (req, res) => {
  try {
    const db = await connectionToDatabase();
    const [rows] = await db.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE
router.put('/updateuser/:id', async (req, res) => {
  const { name, email } = req.body;
  try {
    const db = await connectionToDatabase();
    await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id]);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE
router.delete('/deleteuser/:id', async (req, res) => {
  try {
    const db = await connectionToDatabase();
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// WareHouse Manager 
// Add Warehouse Manager
router.post('/addmanager', async (req, res) => {
    const { name, phone_number, email } = req.body;
    try {
        const db = await connectionToDatabase();

        const [rows] = await db.query('SELECT * FROM warehouse_manager WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: "Manager already exists" });
        }

        await db.query(
            "INSERT INTO warehouse_manager (name, phone_number, email) VALUES (?, ?, ?)",
            [name, phone_number, email]
        );

        res.status(201).json({ message: "Warehouse manager added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get all warehouse managers
router.get('/allmanagers', async (req, res) => {
    try {
        const db = await connectionToDatabase();
        const [rows] = await db.query('SELECT * FROM warehouse_manager');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a warehouse manager
router.delete('/deletemanager/:id', async (req, res) => {
    try {
        const db = await connectionToDatabase();
        await db.query('DELETE FROM warehouse_manager WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: "Manager deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Update a warehouse manager
router.put('/updatemanager/:id', async (req, res) => {
    const { name, phone_number, email } = req.body;
    try {
        const db = await connectionToDatabase();
        await db.query(
            'UPDATE warehouse_manager SET name = ?, phone_number = ?, email = ? WHERE id = ?',
            [name, phone_number, email, req.params.id]
        );
        res.status(200).json({ message: "Manager updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Add Farmer
router.post('/addfarmer', async (req, res) => {
    const { name, address, contactNumber } = req.body;
    try {
      const db = await connectionToDatabase();
      await db.query(
        'INSERT INTO local_farmer (Name, Address, ContactNumber) VALUES (?, ?, ?)',
        [name, address, contactNumber]
      );
      res.status(201).json({ message: "Farmer added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
  // Get all farmers
  router.get('/allfarmers', async (req, res) => {
    try {
      const db = await connectionToDatabase();
      const [rows] = await db.query('SELECT * FROM local_farmer');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
  // Delete Farmer
  router.delete('/deletefarmer/:id', async (req, res) => {
    try {
      const db = await connectionToDatabase();
      await db.query('DELETE FROM local_farmer WHERE FarmerID = ?', [req.params.id]);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
  // Update Farmer
  router.put('/updatefarmer/:id', async (req, res) => {
    const { name, address, contactNumber } = req.body;
    try {
      const db = await connectionToDatabase();
      await db.query(
        'UPDATE local_farmer SET Name = ?, Address = ?, ContactNumber = ? WHERE FarmerID = ?',
        [name, address, contactNumber, req.params.id]
      );
      res.status(200).json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

  // Add Nutritionist
router.post('/addnutritionist', async (req, res) => {
    const { name, qualification, contactNumber, email } = req.body;
    try {
      const db = await connectionToDatabase();
      await db.query(
        'INSERT INTO nutritionist (Name, Qualification, ContactNumber, Email) VALUES (?, ?, ?, ?)',
        [name, qualification, contactNumber, email]
      );
      res.status(201).json({ message: "Nutritionist added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
  // Get all nutritionists
  router.get('/allnutritionists', async (req, res) => {
    try {
      const db = await connectionToDatabase();
      const [rows] = await db.query('SELECT * FROM nutritionist');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
  // Delete nutritionist
  router.delete('/deletenutritionist/:id', async (req, res) => {
    try {
      const db = await connectionToDatabase();
      await db.query('DELETE FROM nutritionist WHERE NutritionistID = ?', [req.params.id]);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
  // Update nutritionist
  router.put('/updatenutritionist/:id', async (req, res) => {
    const { name, qualification, contactNumber, email } = req.body;
    try {
      const db = await connectionToDatabase();
      await db.query(
        'UPDATE nutritionist SET Name = ?, Qualification = ?, ContactNumber = ?, Email = ? WHERE NutritionistID = ?',
        [name, qualification, contactNumber, email, req.params.id]
      );
      res.status(200).json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  

// Add Animal
router.post('/addanimal', async (req, res) => {
    const { FarmerID, Species, Weight, SlaughterDate, NutritionistID, CheckupDate, CheckupNotes } = req.body;
    try {
      const db = await connectionToDatabase();
      await db.query(
        `INSERT INTO animal (FarmerID, Species, Weight, SlaughterDate, NutritionistID, CheckupDate, CheckupNotes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [FarmerID, Species, Weight, SlaughterDate, NutritionistID, CheckupDate, CheckupNotes]
      );
      res.status(201).json({ message: "Animal added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
  // Get All Animals
  router.get('/allanimals', async (req, res) => {
    try {
      const db = await connectionToDatabase();
      const [rows] = await db.query('SELECT * FROM animal');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Delete Animal
  router.delete('/deleteanimal/:id', async (req, res) => {
    try {
      const db = await connectionToDatabase();
      await db.query('DELETE FROM animal WHERE AnimalID = ?', [req.params.id]);
      res.status(200).json({ message: "Animal deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
  // Update Animal
  router.put('/updateanimal/:id', async (req, res) => {
    const { FarmerID, Species, Weight, SlaughterDate, NutritionistID, CheckupDate, CheckupNotes } = req.body;
    try {
      const db = await connectionToDatabase();
      await db.query(
        `UPDATE animal SET FarmerID = ?, Species = ?, Weight = ?, SlaughterDate = ?, 
         NutritionistID = ?, CheckupDate = ?, CheckupNotes = ? WHERE AnimalID = ?`,
        [FarmerID, Species, Weight, SlaughterDate, NutritionistID, CheckupDate, CheckupNotes, req.params.id]
      );
      res.status(200).json({ message: "Animal updated" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

// Add Meat Product
router.post('/addmeatproduct', async (req, res) => {
    const { meat_type, quantity_kg, processing_date, storage_location, batch_number, expiration_date } = req.body;
    try {
      const db = await connectionToDatabase();
      await db.query(
        'INSERT INTO meat_products (meat_type, quantity_kg, processing_date, storage_location, batch_number, expiration_date) VALUES (?, ?, ?, ?, ?, ?)',
        [meat_type, quantity_kg, processing_date, storage_location, batch_number, expiration_date]
      );
      res.status(201).json({ message: "Meat product added" });
    } catch (err) {
      res.status(500).json({ message: "Error adding", error: err.message });
    }
  });
  
  // Get All Meat Products
  router.get('/allmeatproducts', async (req, res) => {
    try {
      const db = await connectionToDatabase();
      const [rows] = await db.query('SELECT * FROM meat_products');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: "Error fetching", error: err.message });
    }
  });
  
  // Delete Meat Product
  router.delete('/deletemeatproduct/:id', async (req, res) => {
    try {
      const db = await connectionToDatabase();
      await db.query('DELETE FROM meat_products WHERE product_id = ?', [req.params.id]);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting", error: err.message });
    }
  });
  
  // Update Meat Product
  router.put('/updatemeatproduct/:id', async (req, res) => {
    const { meat_type, quantity_kg, processing_date, storage_location, batch_number, expiration_date } = req.body;
    try {
      const db = await connectionToDatabase();
      await db.query(
        'UPDATE meat_products SET meat_type=?, quantity_kg=?, processing_date=?, storage_location=?, batch_number=?, expiration_date=? WHERE product_id=?',
        [meat_type, quantity_kg, processing_date, storage_location, batch_number, expiration_date, req.params.id]
      );
      res.status(200).json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Update error", error: err.message });
    }
  });
  
// Add Meat Prep
router.post('/addmeatprep', async (req, res) => {
  const { product_id, MeatCutType, Weight, FatPercentage, Texture, Temperature } = req.body;
  try {
      const db = await connectionToDatabase();
      await db.query(
          'INSERT INTO meat_prep_procedure (product_id, MeatCutType, Weight, FatPercentage, Texture, Temperature) VALUES (?, ?, ?, ?, ?, ?)',
          [product_id, MeatCutType, Weight, FatPercentage, Texture, Temperature]
      );
      res.status(201).json({ message: "Meat prep procedure added" });
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get All
router.get('/allmeatprep', async (req, res) => {
  try {
      const db = await connectionToDatabase();
      const [rows] = await db.query('SELECT * FROM meat_prep_procedure');
      res.status(200).json(rows);
  } catch (err) {
      res.status(500).json({ message: "Server error" });
  }
});

// Delete
router.delete('/deletemeatprep/:id', async (req, res) => {
  try {
      const db = await connectionToDatabase();
      await db.query('DELETE FROM meat_prep_procedure WHERE PrepID = ?', [req.params.id]);
      res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update
router.put('/updatemeatprep/:id', async (req, res) => {
  const { product_id, MeatCutType, Weight, FatPercentage, Texture, Temperature } = req.body;
  try {
      const db = await connectionToDatabase();
      await db.query(
          'UPDATE meat_prep_procedure SET product_id = ?, MeatCutType = ?, Weight = ?, FatPercentage = ?, Texture = ?, Temperature = ? WHERE PrepID = ?',
          [product_id, MeatCutType, Weight, FatPercentage, Texture, Temperature, req.params.id]
      );
      res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add Environmental Condition
router.post('/addenvironment', async (req, res) => {
  const { batch_number, timestamp, temperature_celsius, humidity_percent, location } = req.body;
  try {
    const db = await connectionToDatabase();
    await db.query(
      'INSERT INTO environmental_conditions (batch_number, timestamp, temperature_celsius, humidity_percent, location) VALUES (?, ?, ?, ?, ?)',
      [batch_number, timestamp, temperature_celsius, humidity_percent, location]
    );
    res.status(201).json({ message: "Environmental record added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get All Environmental Records
router.get('/allenvironment', async (req, res) => {
  try {
    const db = await connectionToDatabase();
    const [rows] = await db.query('SELECT * FROM environmental_conditions');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Record
router.delete('/deleteenvironment/:id', async (req, res) => {
  try {
    const db = await connectionToDatabase();
    await db.query('DELETE FROM environmental_conditions WHERE record_id = ?', [req.params.id]);
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Record
router.put('/updateenvironment/:id', async (req, res) => {
  const { batch_number, timestamp, temperature_celsius, humidity_percent, location } = req.body;
  try {
    const db = await connectionToDatabase();
    await db.query(
      'UPDATE environmental_conditions SET batch_number = ?, timestamp = ?, temperature_celsius = ?, humidity_percent = ?, location = ? WHERE record_id = ?',
      [batch_number, timestamp, temperature_celsius, humidity_percent, location, req.params.id]
    );
    res.status(200).json({ message: "Record updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add Loss Record
router.post('/addloss', async (req, res) => {
  const { batch_number, stage, loss_quantity, reason, loss_date } = req.body;
  try {
      const db = await connectionToDatabase();
      await db.query(
          'INSERT INTO loss_tracking (batch_number, stage, loss_quantity, reason, loss_date) VALUES (?, ?, ?, ?, ?)',
          [batch_number, stage, loss_quantity, reason, loss_date]
      );
      res.status(201).json({ message: "Loss record added successfully" });
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get All Loss Records
router.get('/alllosses', async (req, res) => {
  try {
      const db = await connectionToDatabase();
      const [rows] = await db.query('SELECT * FROM loss_tracking');
      res.status(200).json(rows);
  } catch (err) {
      res.status(500).json({ message: "Server error" });
  }
});

// Delete Loss Record
router.delete('/deleteloss/:id', async (req, res) => {
  try {
      const db = await connectionToDatabase();
      await db.query('DELETE FROM loss_tracking WHERE loss_id = ?', [req.params.id]);
      res.status(200).json({ message: "Loss record deleted successfully" });
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Loss Record
router.put('/updateloss/:id', async (req, res) => {
  const { batch_number, stage, loss_quantity, reason, loss_date } = req.body;
  try {
      const db = await connectionToDatabase();
      await db.query(
          'UPDATE loss_tracking SET batch_number = ?, stage = ?, loss_quantity = ?, reason = ?, loss_date = ? WHERE loss_id = ?',
          [batch_number, stage, loss_quantity, reason, loss_date, req.params.id]
      );
      res.status(200).json({ message: "Loss record updated successfully" });
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
});



// Add Sales Distribution
router.post('/addsalesdistribution', async (req, res) => {
  const { batch_number, customer_id, quantity_sold, sale_date, destination } = req.body;
  try {
    const db = await connectionToDatabase();
    await db.query(
      'INSERT INTO sales_distribution (batch_number, customer_id, quantity_sold, sale_date, destination) VALUES (?, ?, ?, ?, ?)',
      [batch_number, customer_id, quantity_sold, sale_date, destination]
    );
    res.status(201).json({ message: "Sales distribution record added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get All Sales Distribution Records
router.get('/allsalesdistribution', async (req, res) => {
  try {
    const db = await connectionToDatabase();
    const [rows] = await db.query('SELECT * FROM sales_distribution');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a Sales Distribution Record
router.delete('/deletesalesdistribution/:id', async (req, res) => {
  try {
    const db = await connectionToDatabase();
    await db.query('DELETE FROM sales_distribution WHERE sale_id = ?', [req.params.id]);
    res.status(200).json({ message: "Sales distribution record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a Sales Distribution Record
router.put('/updatesalesdistribution/:id', async (req, res) => {
  const { batch_number, customer_id, quantity_sold, sale_date, destination } = req.body;
  try {
    const db = await connectionToDatabase();
    await db.query(
      'UPDATE sales_distribution SET batch_number = ?, customer_id = ?, quantity_sold = ?, sale_date = ?, destination = ? WHERE sale_id = ?',
      [batch_number, customer_id, quantity_sold, sale_date, destination, req.params.id]
    );
    res.status(200).json({ message: "Sales distribution record updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add Alert
router.post('/addalert', async (req, res) => {
  const { batch_number, alert_type, message, alert_date } = req.body;
  try {
    const db = await connectionToDatabase();
    await db.query(
      'INSERT INTO alerts (batch_number, alert_type, message, alert_date) VALUES (?, ?, ?, ?)',
      [batch_number, alert_type, message, alert_date]
    );
    res.status(201).json({ message: "Alert added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get All Alerts
router.get('/allalerts', async (req, res) => {
  try {
    const db = await connectionToDatabase();
    const [rows] = await db.query('SELECT * FROM alerts');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Alert
router.delete('/deletealert/:id', async (req, res) => {
  try {
    const db = await connectionToDatabase();
    await db.query('DELETE FROM alerts WHERE alert_id = ?', [req.params.id]);
    res.status(200).json({ message: "Alert deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Alert
router.put('/updatealert/:id', async (req, res) => {
  const { batch_number, alert_type, message, alert_date } = req.body;
  try {
    const db = await connectionToDatabase();
    await db.query(
      'UPDATE alerts SET batch_number = ?, alert_type = ?, message = ?, alert_date = ? WHERE alert_id = ?',
      [batch_number, alert_type, message, alert_date, req.params.id]
    );
    res.status(200).json({ message: "Alert updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a Preventative Measure
router.post('/addmeasure', async (req, res) => {
  const { batch_number, action_taken, responsible_person, date_implemented, effectiveness_note } = req.body;
  try {
    const db = await connectionToDatabase();
    await db.query(
      'INSERT INTO preventative_measures (batch_number, action_taken, responsible_person, date_implemented, effectiveness_note) VALUES (?, ?, ?, ?, ?)',
      [batch_number, action_taken, responsible_person, date_implemented, effectiveness_note]
    );
    res.status(201).json({ message: "Preventative measure added" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get All Preventative Measures
router.get('/allmeasures', async (req, res) => {
  try {
    const db = await connectionToDatabase();
    const [rows] = await db.query('SELECT * FROM preventative_measures');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a Preventative Measure
router.delete('/deletemeasure/:id', async (req, res) => {
  try {
    const db = await connectionToDatabase();
    await db.query('DELETE FROM preventative_measures WHERE measure_id = ?', [req.params.id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a Preventative Measure
router.put('/updatemeasure/:id', async (req, res) => {
  const { batch_number, action_taken, responsible_person, date_implemented, effectiveness_note } = req.body;
  try {
    const db = await connectionToDatabase();
    await db.query(
      'UPDATE preventative_measures SET batch_number = ?, action_taken = ?, responsible_person = ?, date_implemented = ?, effectiveness_note = ? WHERE measure_id = ?',
      [batch_number, action_taken, responsible_person, date_implemented, effectiveness_note, req.params.id]
    );
    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



export default router;






