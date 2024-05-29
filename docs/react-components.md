# 🟢 Available React Components

The documentation presents a collection of React components available for real-time object detection and classification using pre-trained TensorFlow.js models. These components are designed to seamlessly integrate into React Native applications and leverage the device's camera capabilities to detect and classify a variety of objects. Each component provides a straightforward interface for configuration and receiving detection or classification results, making it easy to integrate into existing projects and customize according to specific application needs.

All components extend the properties defined for [`cameraWithTensors`](https://js.tensorflow.org/api_react_native/0.2.1/#cameraWithTensors) from TensorFlow.js and the [`Expo Camera`](https://docs.expo.dev/versions/latest/sdk/camera/) Component. This ensures compatibility and flexibility in integrating advanced camera functionalities and TensorFlow.js processing within your Expo application.

<details> 
<summary><h2>📷 DetectionCocoSSDCamera Component</h2></summary>

This component provides functionality for real-time object detection using the pre-trained COCO-SSD model from TensorFlow.js. It utilizes the device's camera to capture images and detect objects within them.

### Props

| Prop                | Type                   | Description                                                                                                                                                         |
|---------------------|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| onNewResults        | `(results: Object[]) => void` | A callback function invoked when new objects are detected. Receives an array of objects representing the detection results.                                      |
| minPrecision       | `number` (optional)     | The minimum required precision for a detected object to be considered valid, expressed as a percentage (default value: 20).                                       |
| numberOfFrames      | `number` (optional)     | The number of camera frames to process before performing a new detection (default value: 100).                                                                       |
| availableObjects    | `string[]` (optional)   | An array of available object class names for detection. If provided, only objects whose classes are in this list will be detected.                                |

### Usage

```jsx
import DetectionCocoSSDCamera from './path/to/DetectionCocoSSDCamera';

const MyComponent = () => {
  const handleNewResults = (results) => {
    console.log('New detection results:', results);
    // Your logic here
  };

  return (
    <DetectionCocoSSDCamera
      onNewResults={handleNewResults}
      minPrecision={25}
      numberOfFrames={150}
      availableObjects={['person', 'car']}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
```

### Description

The `DetectionCocoSSDCamera` component utilizes TensorFlow.js to load and execute the COCO-SSD model, which is capable of detecting a wide variety of objects in real-time. It uses the device's camera to capture images and analyze them for objects. The detection results are sent through the `onNewResults` callback function, where you can process them as needed. You can adjust the minimum required precision to consider a detected object valid and the number of camera frames to process before performing a new detection. Additionally, you can provide a list of available object classes to limit detection to specific objects.

Here's the documentation for the provided `DetectionMobilenetCamera` component:
</details> 

<details> 
  <summary><h2>📸 DetectionMobilenetCamera Component</h2></summary>

This component provides functionality for real-time object classification using the MobileNet model from TensorFlow.js. It utilizes the device's camera to capture images and classify objects within them.

### Props

| Prop                | Type                   | Description                                                                                                                                                         |
|---------------------|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| version             | `number` (optional)     | The version of the MobileNet model to use (1 or 2, default value: 1).                                                                                               |
| onNewResults        | `(results: Object[]) => void` | A callback function invoked when new objects are classified. Receives an array of objects representing the classification results.                               |
| minPrecision        | `number` (optional)     | The minimum required confidence level for a classified object to be considered valid, expressed as a percentage (default value: 20).                               |
| numberOfFrames      | `number` (optional)     | The number of camera frames to process before performing a new classification (default value: 100).                                                                 |
| availableObjects    | `string[]` (optional)   | An array of available object class names for classification. If provided, only objects whose classes are in this list will be classified.                          |

### Usage

```jsx
import DetectionMobilenetCamera from './path/to/DetectionMobilenetCamera';

const MyComponent = () => {
  const handleNewResults = (results) => {
    console.log('New classification results:', results);
    // Your logic here
  };

  return (
    <DetectionMobilenetCamera
      version={1}
      onNewResults={handleNewResults}
      minPrecision={25}
      numberOfFrames={150}
      availableObjects={['cat', 'dog']}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
```

### Description

The `DetectionMobilenetCamera` component utilizes TensorFlow.js to load and execute the MobileNet model, which is capable of classifying objects in real-time. It uses the device's camera to capture images and classify objects within them. The classification results are sent through the `onNewResults` callback function, where you can process them as needed. You can adjust the minimum required confidence level to consider a classified object valid and the number of camera frames to process before performing a new classification. Additionally, you can provide a list of available object classes to limit classification to specific objects.
</details> 
