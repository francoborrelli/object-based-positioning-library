import { getCurrentPositionAsync, getHeadingAsync } from 'expo-location';
import { CurrentPositionResponse } from '../interfaces/positioning';

export class BasePositioning {
  /**
   * @description Get current user position
   */
  public async getCurrentPosition(): Promise<CurrentPositionResponse> {
    throw new Error('Method not implemented.');
  }
}

export class GpsGyroscopePositioning extends BasePositioning {
  /**
   * @description Get current user position
   */
  public async getCurrentPosition(): Promise<CurrentPositionResponse> {
    const heading = await getHeadingAsync();
    const position = await getCurrentPositionAsync({
      accuracy: 6,
      mayShowUserSettingsDialog: true,
    });

    return {
      heading: heading.trueHeading,
      position: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    };
  }
}
