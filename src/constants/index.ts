import { groupBy, orderBy } from 'lodash';
import { COCO_SSD_CLASSES } from './Coco-ssd';
import { MOBILENET_CLASSES } from './MobileNet';

export const OBJECT_DETECTION_MODELS = ['coco-ssd', 'mobilenet', 'mobilenet v2'] as const;

export const OBJECT_DETECTION_CLASSES = {
  'coco-ssd': groupBy(orderBy(COCO_SSD_CLASSES, 'displayName'), 'category'),
  mobilenet: groupBy(
    orderBy(
      MOBILENET_CLASSES.filter((c) => c.category && c.visible),
      'displayName'
    ),
    'category'
  ),
  'mobilenet v2': groupBy(
    orderBy(
      MOBILENET_CLASSES.filter((c) => c.category && c.visible),
      'displayName'
    ),
    'category'
  ),
} as const;

export const OBJECT_DETECTION_CLASSES_ARRAY = {
  'coco-ssd': orderBy(COCO_SSD_CLASSES, 'displayName'),
  mobilenet: orderBy(
    MOBILENET_CLASSES.filter((c) => c.category && c.visible),
    'displayName'
  ),
  'mobilenet v2': orderBy(
    MOBILENET_CLASSES.filter((c) => c.category && c.visible),
    'displayName'
  ),
} as const;
