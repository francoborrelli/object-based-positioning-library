import React, { useState, useCallback, useEffect } from 'react';

// Tensorflow js
import '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// Components
import CustomActivityIndicator from './ActivityIndicator';

// Utils
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

// Constants
import * as ScreenOrientation from 'expo-screen-orientation';
import { OBJECT_DETECTION_CLASSES_ARRAY } from '../constants';

// Interfaces
import type { FC } from 'react';
import type { MobileNetCameraProps } from '../interfaces/camera';

let frame = 0;

// @ts-ignore
const TensorCameraComponent = cameraWithTensors(Camera);

export const DetectionMobilenetCamera: FC<MobileNetCameraProps> = (props) => {
  const {
    version = 1,
    onNewResults,
    minPrecision = 20,
    numberOfFrames = 100,
    availableObjects = [],
    ...otherProps
  } = props;

  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
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
      const model = await mobilenet.load({ version, alpha: 1 });
      setModel(model);
    }

    prepare();
    initializeModel();
    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
    };
  }, [model, version]);

  const handleCameraStream = useCallback(
    (images: IterableIterator<tf.Tensor3D>) => {
      const NUMBER_OF_FRAMES = numberOfFrames;

      const loop = async () => {
        if (model) {
          if (frame % NUMBER_OF_FRAMES === 0) {
            const nextImageTensor = images.next().value;
            if (nextImageTensor) {
              const objects = await model.classify(nextImageTensor);
              if (objects && objects.length > 0) {
                let filteredPredictions = objects.filter((prediction) =>
                  OBJECT_DETECTION_CLASSES_ARRAY[version == 1 ? 'mobilenet' : 'mobilenet v2']
                    .map((r) => r.value)
                    .filter((r) =>
                      availableObjects && availableObjects.length
                        ? availableObjects.includes(r)
                        : true
                    )
                    .includes(prediction.className)
                );

                filteredPredictions = filteredPredictions.filter(
                  (d) => d.probability * 100 > minPrecision
                );

                if (onNewResults) {
                  onNewResults(
                    filteredPredictions.map((object) => {
                      const label = OBJECT_DETECTION_CLASSES_ARRAY[
                        version == 1 ? 'mobilenet' : 'mobilenet v2'
                      ].find((item) => item.value === object.className)?.displayName!;
                      return {
                        label,
                        id: object.className,
                        percentage: object.probability * 100,
                      };
                    })
                  );
                }
              }
              tf.dispose([nextImageTensor]);
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

export default DetectionMobilenetCamera;
