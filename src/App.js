import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as tf from "@tensorflow/tfjs";
import TagsContainer from './components/TagsContainer';

function App() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [imageURL, setImageURl] = useState(null);  
  const [isNSFW, setIsNSFW] = useState(false);  
  const labels = ['Neutral','Hentai','Sexy','Drawing','Porn'];
  
  useEffect(() => {
    const loadModel = async () => {
      const  model = await tf.loadLayersModel('https://d1zv2aa70wpiur.cloudfront.net/tfjs_quant_nsfw_mobilenet/model.json');
      setModel(model);
    };
    loadModel();
  }, []);

  const handleUploadChange = ({ target }) => {
    const url = URL.createObjectURL(target.files[0]);
    setImageURl(url);
  }

  useEffect(() => {
    tf.ready();
  }, []);

  const onImageChange = async ({ target }) => {
    const imgEl = document.getElementById('img');
   
    let tensor = tf.browser.fromPixels(imgEl)
    .resizeBilinear([224, 224])
    .expandDims(0)
    .toFloat()
    .div(tf.scalar(127))
    .sub(tf.scalar(1));

    let predictions = await model.predict(tensor).array();
   const maping =  predictions[0].map((element,index) => {
      return Math.round((element*100),2) > 50  && labels[index];
    });
    setIsNSFW(maping.some((category)=>['Sexy','Hentai','Porn'].includes(category)));
    setPredictions(predictions[0]);
  };

  const renderInput = () => (
    <input
      type="file"
      onChange={handleUploadChange}
      accept="image/x-png,image/gif,image/jpeg"
    />
  );

  const renderPreview = () => (
      <img alt="preview" onLoad={onImageChange} src={imageURL} id='img' width={299} height={299}/>
  );

  return (
    <div className="App">
      {!model ? (
        <>Loading </>
      ) : (
        <>
          {renderInput()}
          {imageURL && renderPreview()}
          {!!predictions.length && <TagsContainer predictions={predictions} />}
          {isNSFW && <h1 style={{backgroundColor:'red', padding:'20px'}}> Blur Image using Mantine Overlay </h1>}
        </>
      )}
    </div>
  );
}

export default App;
