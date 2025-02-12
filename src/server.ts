import app from "./app";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.listen(PORT, () => {
  console.log('Hello');
  console.log(`Server is running at http://localhost:${PORT}`);
});
