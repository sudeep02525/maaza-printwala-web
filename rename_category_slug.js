const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maaza_printwala';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to DB');
  
  // Update Category slug
  const db = mongoose.connection.db;
  const result = await db.collection('categories').updateOne(
    { slug: 'business-printing' },
    { $set: { slug: 'visiting-cards' } }
  );
  
  console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s) in categories.`);
  
  // We should also check if any other collection has the slug hardcoded
  // Products have category as ObjectId, so that's fine.
  
  mongoose.disconnect();
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
