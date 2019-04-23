import { Booth } from '../../../def';

export interface MenuApiResponse {
  correlationId: string;
  data: Array<{
    cafeteriaId: string;
    calories: number;
    component: {
      componentId: number;
      carb: number;
      fat: number;
      protein: number;
      sodium: number;
    };
    imageURL: string;
    ingredients: {
      alcohol: boolean;
      beef: boolean;
      chicken: boolean;
      fish: boolean;
      healthy: boolean;
      ingredientsId: boolean;
      mutton: boolean;
      pork: boolean;
    };
    mealDate: string;
    mealTime: 1 | 2;
    menuId: number;
    menuType: Booth;
    price: number;
    title: string;
    umaiCount: number;
  }>;
  errorMessage: string;
  result: string;
}

interface CongestionApiResponse {
  crowd_rate: number;
  unixtime: number;
}
