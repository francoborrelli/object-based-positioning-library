# Object Based Positioning Library

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37) ![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

> [!NOTE] > **Summary:** Object-based-Positioning is a library that aims to explore an alternative for indoor positioning using the concept of Positioned Objects. The library works as a proof of concept and allows for the use of various object recognition and detection models in combination with sensor information and algorithms to position users. This library works exclusively with **React Native** and **Expo**. A concrete implementation using **Firebase** to store data is presented, although other mechanisms could be used.

## 📚 Table of Contents

1. 🌟 [Introduction](#-introduction)
2. 🔑 [Key Features](#-key-features)
3. 📥 [Installation](#-installation)
4. 📖 [Documentation](#-documentation)
   - 🔧 [BaseObjectBasedPositioning class](#baseObjectBasedPositioning-class)
   - 🛠️ [FirebaseObjectBasedPositioning class](#firebaseObjectBasedPositioning-class)

## 🌟 Introduction

The aim of the repository is to present a proof of concept for achieving positioning using object recognition and detection models. This library was developed as part of my master's thesis titled "Exploración del posicionamiento indoor mediante el reconocimiento de objetos con el fin de co-diseñar y co-testear aplicaciones móviles sensibles al contexto". It works exclusively with React Native and Expo, using the TensorFlow platform to support object recognition. Additionally, the positioning system leverages GPS and gyroscope sensors to enhance accuracy and provide robust location data.

The positioning mechanism works like this:

- In the first stage, called “creation,” the user uses their phone's camera to scan the environment and select different objects of interest in the room. When an object is selected, the library uses the data from the model and combines it with contextual data gathered through various sensors, particularly the GPS and gyroscope. All this data is then stored to represent a relevant location. It's worth noting that the library lets you choose from a variety of recognition models, and it's scalable to add new ones in the future.

- In the second stage, known as "usage," the stored data is compared with the device's current view to determine the user's position and, for example, to provide relevant information.

## 📥 Installation

```sh

npm i object-based-positioning

```

## 🔑 Key Features

🟢 Real-time object detection and classification.

📍 Indoor positioning using object recognition models.

⚙️ Easy integration with React Native and Expo.

🔧 Configurable detection settings and model options.

## 📖 Documentation

### BaseObjectBasedPositioning class

<details open>
<summary><h3>Public Methods</h3></summary>

| Method Name                        | Description                                                                  | Parameters                                  | Returns                            |
| ---------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------- |
| `setCurrentModel`                  | Set the current model.                                                       | `model: MODEL`                              | `void`                             |
| `addCustomModel`                   | Add a new custom model.                                                      | `model: string`, `component: any`           | `void`                             |
| `getCurrentModel`                  | Get the current model.                                                       | None                                        | `MODEL`                            |
| `getReactCameraComponent`          | Get the React component for the current model.                               | None                                        | `React.LazyExoticComponent<any>`   |
| `setCurrentPositioningMethod`      | Set the current positioning method.                                          | `method: POSITIONING_METHODS`               | `void`                             |
| `getCurrentPositioningMethod`      | Get the current positioning method.                                          | None                                        | `POSITIONING_METHODS`              |
| `getCurrentPositioningMethodClass` | Get the current positioning method class.                                    | None                                        | `BasePositioning`                  |
| `getCurrentPosition`               | Get the current position using the current positioning method.               | None                                        | `Promise<CurrentPositionResponse>` |
| `setMaxDistanceToDetectObjects`    | Set the maximum distance to detect objects in meters.                        | `distance: number`                          | `void`                             |
| `getMaxDistanceToDetectObjects`    | Get the maximum distance to detect objects in meters.                        | None                                        | `number`                           |
| `setMaxHeadingToDetectObjects`     | Set the maximum heading to detect objects in degrees.                        | `heading: number`                           | `void`                             |
| `getMaxHeadingToDetectObjects`     | Get the maximum heading to detect objects in degrees.                        | None                                        | `number`                           |
| `setDatabase`                      | Set the database.                                                            | `database: any`                             | `void`                             |
| `getDatabase`                      | Get the database.                                                            | None                                        | `any`                              |
| `onRegisterObject`                 | Register a new object in the database. (Abstract method, to be implemented)  | `object: TensorCameraResult`, `extra?: any` | `Promise<void>`                    |
| `onUnregisterObject`               | Unregister an object from the database. (Abstract method, to be implemented) | `id: string`                                | `Promise<void>`                    |
| `getRegisteredObjects`             | Get all registered objects. (Abstract method, to be implemented)             | `conditions: any`                           | `Promise<any>`                     |
| `getNearbyObjects`                 | Get all nearby objects. (Abstract method, to be implemented)                 | None                                        | `Promise<any>`                     |

</details>

### FirebaseObjectBasedPositioning class

`FirebaseObjectBasedPositioning` is a class that extends the functionality of `BaseObjectBasedPositioning` to provide an indoor positioning mechanism based on storing and managing data in Firebase. This class allows you to register and unregister objects in a Firestore database, retrieve registered objects, and get nearby objects based on the user's current position.

<details open>
<summary><h3>Public Methods</h3></summary>

| Method Name            | Description                                                                 | Parameters                                                         | Returns                                             |
| ---------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| `getCollectionName`    | Get the collection name.                                                    | None                                                               | `string`                                            |
| `getCollection`        | Get the collection reference.                                               | None                                                               | `CollectionReference<FirebaseObject, DocumentData>` |
| `onRegisterObject`     | Register a new object in the database.                                      | `objectData: TensorCameraResult`, `extraData: Record<string, any>` | `Promise<void>`                                     |
| `onUnregisterObject`   | Delete an object in the database by its ID.                                 | `id: string`                                                       | `Promise<void>`                                     |
| `getRegisteredObjects` | Get all registered objects in Firebase based on conditions.                 | `conditions: QueryConstraint \| QueryNonFilterConstraint`          | `Promise<FirebaseObject[]>`                         |
| `getNearbyObjects`     | Get all nearby objects based on the current position and configured limits. | None                                                               | `Promise<FirebaseObject[]>`                         |

</details>

<details open>
<summary><h3>Example Usage</h3></summary>

### Create an instance

```typescript
import { Firestore } from 'firebase/firestore';
import { FirebaseObjectBasedPositioning } from './path/to/FirebaseObjectBasedPositioning';

// Initialize Firestore (make sure to replace with your own configuration)
const firestore: Firestore = ...; // Your Firestore initialization here

// Create an instance of FirebaseObjectBasedPositioning
const positioning = new FirebaseObjectBasedPositioning(firestore);
```

### Changing default settings

```typescript
// Change the default collection name
positioning.setCollectionName('new-collection-name');

// Change the current object detection model
positioning.setCurrentModel('mobilenet v2');

// Add a custom model
const CustomModelComponent = React.lazy(() => import('../components/CustomModelCamera'));
positioning.addCustomModel('custom-model', CustomModelComponent);

// Change the current positioning method
positioning.setCurrentPositioningMethod('custom-positioning-method');

// Set the maximum distance to detect objects
positioning.setMaxDistanceToDetectObjects(20); // 20 meters

// Set the maximum heading to detect objects
positioning.setMaxHeadingToDetectObjects(90); // 90 degrees
```

### Registering new object

```typescript
// Example of registering an object
const tensorCameraResult = {
  /* TensorCameraResult data here */
};
const extraData = {
  /* Any extra data here */
};

positioning
  .onRegisterObject(tensorCameraResult, extraData)
  .then(() => {
    console.log('Object registered successfully.');
  })
  .catch((error) => {
    console.error('Error registering object:', error);
  });
```

### Unregistering existing object

```typescript
// Example of unregistering an object
const objectId = '1234567890';

positioning
  .onUnregisterObject(objectId)
  .then(() => {
    console.log('Object unregistered successfully.');
  })
  .catch((error) => {
    console.error('Error unregistering object:', error);
  });
```

### Retriving objects

```typescript
// Example of getting all registered objects with some condition
const conditions = {
  /* Your conditions here */
};

positioning
  .getRegisteredObjects(conditions)
  .then((objects) => {
    console.log('Registered objects:', objects);
  })
  .catch((error) => {
    console.error('Error getting registered objects:', error);
  });

// Example of getting nearby objects
positioning
  .getNearbyObjects()
  .then((nearbyObjects) => {
    console.log('Nearby objects:', nearbyObjects);
  })
  .catch((error) => {
    console.error('Error getting nearby objects:', error);
  });
```

</details>

### Get React Component

> [!NOTE]
> More information about these Components can be found [here](https://github.com/francoborrelli/object-based-positioning-library/blob/master/docs/react-components.md#-detectioncocossdcamera-component).

The documentation presents a collection of React components available for real-time object detection and classification using pre-trained TensorFlow.js models. These components are designed to seamlessly integrate into React Native applications and leverage the device's camera capabilities to detect and classify a variety of objects. Each component provides a straightforward interface for configuring and receiving detection or classification results. They allow the phone's camera to view the environment and send images for processing by the object recognition model, making it easy to integrate into existing projects and customize according to specific application needs.

```js
// Change the current object detection model
positioning.setCurrentModel('mobilenet v2');

// Get Camera Component for Mobilenet v2
const Component = positioning.getReactCameraComponent();

const App = () => {
  const handleNewResults = (results) => {
    console.log('New detection results:', results);
    // Your logic here
  };

  return (
    <Component
      minPrecision={25}
      numberOfFrames={150}
      onNewResults={handleNewResults}
      availableObjects={['person', 'car']}
    />
  );
};
```
