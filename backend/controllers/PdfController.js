const PdfDetails = require('../models/PdfDetails');

const uploadFile = async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const filename = req.file.filename;

  try {
    await PdfDetails.create({ title: title, pdf: filename });
    res.send({ status: 'ok' });
  } catch (error) {
    res.json({ status: error });
  }
};

const getFiles = async (req, res) => {
  try {
    const data = await PdfDetails.find({});
    res.send({ status: 'ok', data: data });
  } catch (error) {
    res.json({ status: error });
  }
};

module.exports = {
  uploadFile,
  getFiles,
};