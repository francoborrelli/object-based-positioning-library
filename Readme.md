# Object Based Positioning Library

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)  ![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37) ![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

> [!NOTE]
> **Summary:** Prototype mechanism for achieving user positioning in indoor spaces using object recognition and detection models. This library works exclusively with **React Native** and **Expo**. A concrete implementation using **Firebase** to store data is presented, although other mechanisms could be used.


## 🌟 Introduction

This library is presented as a concrete implementation aimed at enabling a proof of concept. The library allows for positioning users in indoor spaces using various object recognition models. To achieve positioning, there are two stages involved. In the first stage, the user needs to use their phone's camera to scan the environment, recording different objects present in the space. These "points of interest" can then be accessed in the second stage, providing contextual information or services to other users.

## 📚 Table of Contents

1. 🌟 [Introduction](#introduction)
2. 📖 [Documentation](#documentation)
   - 🔧 [BaseObjectBasedPositioning class](#public-methods)
   - 🛠️ [FirebaseObjectBasedPositioning class](#example-usage)


## 📖 Documentation

## BaseObjectBasedPositioning class



<details open>
<summary><h3>Public Methods</h3></summary>

| Method Name                        | Description                                                                 | Parameters                                     | Returns                                          |
|------------------------------------|-----------------------------------------------------------------------------|------------------------------------------------|--------------------------------------------------|
| `setCurrentModel`                  | Set the current model.                                                      | `model: MODEL`                                 | `void`                                           |
| `addCustomModel`                   | Add a new custom model.                                                     | `model: string`, `component: any`              | `void`                                           |
| `getCurrentModel`                  | Get the current model.                                                      | None                                           | `MODEL`                                          |
| `getReactCameraComponent`          | Get the React component for the current model.                              | None                                           | `React.LazyExoticComponent<any>`                 |
| `setCurrentPositioningMethod`      | Set the current positioning method.                                         | `method: POSITIONING_METHODS`                  | `void`                                           |
| `getCurrentPositioningMethod`      | Get the current positioning method.                                         | None                                           | `POSITIONING_METHODS`                            |
| `getCurrentPositioningMethodClass` | Get the current positioning method class.                                   | None                                           | `BasePositioning`                                |
| `getCurrentPosition`               | Get the current position using the current positioning method.              | None                                           | `Promise<CurrentPositionResponse>`               |
| `setMaxDistanceToDetectObjects`    | Set the maximum distance to detect objects in meters.                       | `distance: number`                             | `void`                                           |
| `getMaxDistanceToDetectObjects`    | Get the maximum distance to detect objects in meters.                       | None                                           | `number`                                         |
| `setMaxHeadingToDetectObjects`     | Set the maximum heading to detect objects in degrees.                       | `heading: number`                              | `void`                                           |
| `getMaxHeadingToDetectObjects`     | Get the maximum heading to detect objects in degrees.                       | None                                           | `number`                                         |
| `setDatabase`                      | Set the database.                                                           | `database: any`                                | `void`                                           |
| `getDatabase`                      | Get the database.                                                           | None                                           | `any`                                            |
| `onRegisterObject`                 | Register a new object in the database. (Abstract method, to be implemented) | `object: TensorCameraResult`, `extra?: any`    | `Promise<void>`                                  |
| `onUnregisterObject`               | Unregister an object from the database. (Abstract method, to be implemented)| `id: string`                                   | `Promise<void>`                                  |
| `getRegisteredObjects`             | Get all registered objects. (Abstract method, to be implemented)            | `conditions: any`                              | `Promise<any>`                                   |
| `getNearbyObjects`                 | Get all nearby objects. (Abstract method, to be implemented)                | None                                           | `Promise<any>`                                   |
</details>

## FirebaseObjectBasedPositioning class

`FirebaseObjectBasedPositioning` is a class that extends the functionality of `BaseObjectBasedPositioning` to provide an indoor positioning mechanism based on storing and managing data in Firebase. This class allows you to register and unregister objects in a Firestore database, retrieve registered objects, and get nearby objects based on the user's current position.


<details open>
<summary><h3>Public Methods</h3></summary>

| Method Name              | Description                                                              | Parameters                                                                                              | Returns                                         |
|--------------------------|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| `getCollectionName`      | Get the collection name.                                                 | None                                                                                                    | `string`                                        |
| `getCollection`          | Get the collection reference.                                            | None                                                                                                    | `CollectionReference<FirebaseObject, DocumentData>` |
| `onRegisterObject`       | Register a new object in the database.                                    | `objectData: TensorCameraResult`, `extraData: Record<string, any>`                                       | `Promise<void>`                                 |
| `onUnregisterObject`     | Delete an object in the database by its ID.                               | `id: string`                                                                                            | `Promise<void>`                                 |
| `getRegisteredObjects`   | Get all registered objects in Firebase based on conditions.               | `conditions: QueryConstraint \| QueryNonFilterConstraint`                                                | `Promise<FirebaseObject[]>`                     |
| `getNearbyObjects`       | Get all nearby objects based on the current position and configured limits.| None                                                                                                    | `Promise<FirebaseObject[]>`                     |
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
const tensorCameraResult = { /* TensorCameraResult data here */ };
const extraData = { /* Any extra data here */ };

positioning.onRegisterObject(tensorCameraResult, extraData)
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

positioning.onUnregisterObject(objectId)
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
const conditions = { /* Your conditions here */ };

positioning.getRegisteredObjects(conditions)
  .then((objects) => {
    console.log('Registered objects:', objects);
  })
  .catch((error) => {
    console.error('Error getting registered objects:', error);
  });

// Example of getting nearby objects
positioning.getNearbyObjects()
  .then((nearbyObjects) => {
    console.log('Nearby objects:', nearbyObjects);
  })
  .catch((error) => {
    console.error('Error getting nearby objects:', error);
  });
```
</details>

