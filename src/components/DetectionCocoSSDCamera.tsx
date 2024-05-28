import React, { useState, useCallback, useEffect } from 'react';

// Tensorflow js
import '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import * as cocoSSD from '@tensorflow-models/coco-ssd';

// Components
import CustomActivityIndicator from './ActivityIndicator';

// Utils
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

// Constants
import * as ScreenOrientation from 'expo-screen-orientation';

// Interfaces
import type { FC } from 'react';
import type { CocoSsdCameraProps } from '../interfaces/camera';
import { OBJECT_DETECTION_CLASSES_ARRAY } from '../constants';

let frame = 0;

// @ts-ignore
const TensorCameraComponent = cameraWithTensors(Camera);

const DetectionCocoSSDCamera: FC<CocoSsdCameraProps> = (props) => {
  const {
    onNewResults,
    minPrecision = 20,
    numberOfFrames = 100,
    availableObjects = [],
    ...otherProps
  } = props;

  const [model, setModel] = useState<cocoSSD.ObjectDetection | null>(null);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation>();

  useEffect(() => {
    async function prepare() {
      const curOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(curOrientation);

      ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });
    }
    async function initializeModel() {
      await tf.ready();
      const model = await cocoSSD.load();
      setModel(model);
    }

    prepare();
    initializeModel();
    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
      if (model) model.dispose();
    };
  }, [model]);

  const handleCameraStream = useCallback(
    (images: IterableIterator<tf.Tensor3D>) => {
      const NUMBER_OF_FRAMES = numberOfFrames;

      const loop = async () => {
        if (model) {
          if (frame % NUMBER_OF_FRAMES === 0) {
            const nextImageTensor = images.next().value;
            if (nextImageTensor) {
              await model
                .detect(nextImageTensor)
                .then((predictions) => {
                  let filteredPredictions = predictions.filter((d) => d.score * 100 > minPrecision);

                  if (availableObjects.length > 0) {
                    filteredPredictions = filteredPredictions.filter((d) =>
                      availableObjects.includes(d.class)
                    );
                  }

                  if (onNewResults) {
                    const results = filteredPredictions.map((object) => {
                      const label = OBJECT_DETECTION_CLASSES_ARRAY['coco-ssd'].find(
                        (item) => item.name === object.class
                      )?.displayName!;
                      return {
                        label,
                        id: object.class,
                        bbox: object.bbox,
                        percentage: object.score * 100,
                      };
                    });
                    onNewResults(results);
                  }
                })
                .catch((e) => console.log(e));
            }
          }
          frame += 1;
          frame = frame % NUMBER_OF_FRAMES;
        }
        requestAnimationFrame(loop);
      };
      loop();
    },
    [model]
  );

  if (!model) {
    return <CustomActivityIndicator />;
  }

  return (
    //@ts-ignore
    <TensorCameraComponent
      resizeWidth={3}
      // @ts-ignore
      orientation={orientation!}
      onReady={handleCameraStream}
      {...otherProps}
    />
  );
};

export default DetectionCocoSSDCamera;
