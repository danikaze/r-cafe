export interface MenuApiResult {
  MenuId: number;
  Timezone: 'Lunch' | 'Dinner';
  Ingredients?: string;
  Ingredients_Image?: string;
}

export interface MenuDetailsApiResult {
  Id: number;
  MenuID: number;
  MenuTitle?: string;
  Title?: string;
  Calory: string;
  Carb: string;
  Lipid: string;
  Protein: string;
  Sodium: string;
  Value: string;
}

export interface MenuApiResponse {
  d: {
    results: MenuApiResult[];
  };
}

export interface MenuDetailsApiResponse {
  d: {
    results: MenuDetailsApiResult[];
  };
}
