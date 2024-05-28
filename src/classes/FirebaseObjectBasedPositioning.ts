// Interfaces
import type {
  Firestore,
  DocumentData,
  QueryConstraint,
  SnapshotOptions,
  CollectionReference,
  QueryDocumentSnapshot,
  QueryNonFilterConstraint,
} from 'firebase/firestore';

import type { FirebaseObject } from '../interfaces/firebase';
import type { TensorCameraResult } from '../interfaces/detection';

import { BaseObjectBasedPositioning } from './ObjectBasedPositioning';

import { isPointWithinRadius } from 'geolib';

import {
  doc,
  // and,
  // where,
  query,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

const objectConverter = {
  toFirestore(object: FirebaseObject): DocumentData {
    return object;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FirebaseObject {
    const data = snapshot.data(options)!;
    return data as FirebaseObject;
  },
};

export class FirebaseObjectBasedPositioning extends BaseObjectBasedPositioning {
  /**
   * @description Name of the collection to store the objects in firestore
   */
  private collectionName = 'object-based-positioning';

  /**
   * @description Collection reference
   */
  private collection: CollectionReference<FirebaseObject, DocumentData>;

  constructor(database: Firestore, collectionName?: string) {
    super();
    this.setDatabase(database);
    if (collectionName) this.setCollectionName(collectionName);
    this.collection = collection(this.getDatabase(), this.collectionName).withConverter(
      objectConverter
    );
  }

  /**
   * @description Set the collection name
   * @param collectionName - Collection name
   * @returns void
   */
  private setCollectionName(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * @description Creates collection reference
   */
  private createCollection() {
    this.collection = collection(this.getDatabase(), this.collectionName).withConverter(
      objectConverter
    );
  }

  /**
   * @description Get the collection name
   * @returns string
   */
  public getCollectionName() {
    return this.collectionName;
  }

  /**
   * @description Get the collection reference
   * @returns CollectionReference<FirebaseObject, DocumentData>
   */
  public getCollection() {
    return this.collection;
  }

  /**
   * @description Register a new object in the database
   */
  public onRegisterObject = async (
    objectData: TensorCameraResult,
    extraData: Record<string, any>
  ) => {
    const created_at = serverTimestamp();
    const id = new Date().getTime().toString();
    const currentPosition = await this.getCurrentPosition();

    const docData = {
      id,
      created_at,
      extra: extraData,
      object: objectData,
      updated_at: created_at,
      position: currentPosition,
    } as FirebaseObject;

    return setDoc(doc(this.collection, id), docData);
  };

  /**
   * @description Delete an object in the database by its id
   */
  public onUnregisterObject = async (id: string) => {
    return deleteDoc(doc(this.collection, id));
  };

  /**
   * @description Get all registered objects in firebase
   */
  public getRegisteredObjects = async (conditions: QueryConstraint | QueryNonFilterConstraint) => {
    const q = query(this.collection, conditions);
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((value) => value.data());
    return data;
  };

  /**
   * @description Get all nearby objects
   */
  public getNearbyObjects = async () => {
    const currentPosition = await this.getCurrentPosition();

    const maxHeadingAllowed = this.getMaxHeadingToDetectObjects();
    const maxDistanceAllowed = this.getMaxDistanceToDetectObjects();

    const q = query(
      this.collection
      // and(
      //   and(
      //     where('position.latitude', '>=', currentPosition.position.latitude - maxDistanceAllowed),
      //     where('position.latitude', '<=', currentPosition.position.latitude - maxDistanceAllowed)
      //   ),
      //   and(
      //     where(
      //       'position.longitude',
      //       '>=',
      //       currentPosition.position.longitude - maxDistanceAllowed
      //     ),
      //     where('position.longitude', '<=', currentPosition.position.longitude - maxDistanceAllowed)
      //   )
      // )
    );

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((value) => value.data());

    return data
      .filter((value) => {
        return isPointWithinRadius(
          {
            latitude: value.position.position.latitude,
            longitude: value.position.position.longitude,
          },
          {
            latitude: currentPosition.position.latitude,
            longitude: currentPosition.position.longitude,
          },
          maxDistanceAllowed
        );
      })
      .filter((value) => {
        return (
          !value.position.heading ||
          Math.abs(value.position.heading - currentPosition.heading) < maxHeadingAllowed
        );
      });
  };
}
