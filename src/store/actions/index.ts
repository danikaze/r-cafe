import { LoadMenu, UpdateMenu } from './menu';
import { UpdateCurrentCongestion } from './congestion';
import { SelectTime, SelectCafeteria, ToggleOrderType, ToggleOrderDirection } from './ui';
import { UpdateApiAccess, UpdateRapAccess } from './service';

export type Action = SelectTime
                   | SelectCafeteria
                   | LoadMenu
                   | UpdateMenu
                   | UpdateCurrentCongestion
                   | ToggleOrderType
                   | ToggleOrderDirection
                   | UpdateApiAccess
                   | UpdateRapAccess
                   ;
