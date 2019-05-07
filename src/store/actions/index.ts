import { LoadMenu, LoadMenuError, UpdateMenu } from './menu';
import { UpdateCurrentCongestion } from './congestion';
import { SelectTime, SelectCafeteria, ToggleOrderType, ToggleOrderDirection, SelectDay, ShowDaySelection } from './ui';
import { UpdateApiAccess, UpdateRapAccess } from './service';

export type Action = SelectTime
                   | SelectDay
                   | ShowDaySelection
                   | SelectCafeteria
                   | LoadMenu
                   | LoadMenuError
                   | UpdateMenu
                   | UpdateCurrentCongestion
                   | ToggleOrderType
                   | ToggleOrderDirection
                   | UpdateApiAccess
                   | UpdateRapAccess
                   ;
