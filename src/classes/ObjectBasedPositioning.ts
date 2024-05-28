import React from 'react';
import { OBJECT_DETECTION_MODELS } from '../constants';
import { BasePositioning, GpsGyroscopePositioning } from './GpsGyroscopePositioning';

import type { TensorCameraResult } from '../interfaces/detection';

type MODEL = (typeof OBJECT_DETECTION_MODELS)[number] | string;

type POSITIONING_METHODS = 'gps-gyroscope' | string;

export class BaseObjectBasedPositioning {
  private database: any;

  // Object detection module data
  private currentModel: MODEL = OBJECT_DETECTION_MODELS[0];
  private components: Record<MODEL | string, any> = {
    'coco-ssd': React.lazy(() => import('../components/DetectionCocoSSDCamera')),
    mobilenet: React.lazy(() => import('../components/DetectionMobilenetCamera')),
    'mobilenet v2': React.lazy(() => import('../components/DetectionMobilenetCamera')),
  };

  // Positioning module data
  private currentPositioningMethod: POSITIONING_METHODS = 'gps-gyroscope';
  private positioning: Record<POSITIONING_METHODS | string, BasePositioning> = {
    'gps-gyroscope': new GpsGyroscopePositioning(),
  };

  // Maximum distance to detect objects in meters
  private detectionDetectorMeters = 10;

  // Maximum heading to detect objects in degrees
  private detectionMaxHeading = 45;

  /**
   * @description Set the current model
   */
  public setCurrentModel(model: MODEL) {
    this.currentModel = model;
  }

  /**
   * @description Add new custom model
   * @param model - Model name
   * @param component - React component with TensorCameraProps as props
   */
  public addCustomModel(model: string, component: any) {
    this.components[model] = component;
  }

  /**
   * @description Get the current model
   */
  public getCurrentModel() {
    return this.currentModel;
  }

  /**
   * @description Get the component for the current model
   */
  public getReactCameraComponent() {
    return this.components[this.currentModel];
  }

  /**
   * @description Set the current positioning method
   */
  public setCurrentPositioningMethod(method: POSITIONING_METHODS) {
    this.currentPositioningMethod = method;
  }

  /**
   * @description Get the current positioning method
   */
  public getCurrentPositioningMethod() {
    return this.currentPositioningMethod;
  }

  /**
   * @description Get the current positioning method class
   */
  public getCurrentPositioningMethodClass() {
    return this.positioning[this.currentPositioningMethod];
  }

  /**
   * @description Get user current position using current positioning method
   * @returns Promise<CurrentPositionResponse>
   */
  public async getCurrentPosition() {
    return await this.positioning[this.currentPositioningMethod].getCurrentPosition();
  }

  /**
   * @description Set the maximum distance to detect objects in meters
   */
  public setMaxDistanceToDetectObjects(distance: number) {
    this.detectionDetectorMeters = distance;
  }

  /**
   * @description Get the maximum distance to detect objects in meters
   */
  public getMaxDistanceToDetectObjects() {
    return this.detectionDetectorMeters;
  }

  /**
   * @description Set the maximum heading to detect objects in degrees
   */
  public setMaxHeadingToDetectObjects(heading: number) {
    if (heading > 359 || heading < 0) {
      throw new Error('Heading must be between 0 and 359 degrees');
    }
    this.detectionMaxHeading = heading;
  }

  /**
   * @description Get the maximum heading to detect objects in degrees
   */
  public getMaxHeadingToDetectObjects() {
    return this.detectionMaxHeading;
  }

  /**
   * @description Set the database
   */
  public setDatabase(database: any) {
    this.database = database;
  }

  /**
   * @description Get the database
   */
  public getDatabase() {
    return this.database;
  }

  /*********************************
   *        Abstract methods
   *********************************/

  /**
   * @description Register a new object in the database
   * @param object TensorCameraResult
   * @param extra Record<string,string> | undefined
   */
  public async onRegisterObject(object: TensorCameraResult, extra?: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  /**
   * @description Unregister an object from the database
   * @param id string
   */
  public async onUnregisterObject(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  /**
   * @description Get all registered objects
   */
  public async getRegisteredObjects(conditions: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  /**
   * @description Get all nearby objects
   */
  public async getNearbyObjects(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
