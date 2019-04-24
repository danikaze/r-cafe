export interface UpdateApiAccess {
  type: 'updateApiAccess';
  status: boolean;
}

export interface UpdateRapAccess {
  type: 'updateRapAccess';
  status: boolean;
}

export function updateApiAccess(status: boolean): UpdateApiAccess {
  return {
    status,
    type: 'updateApiAccess',
  };
}

export function updateRapAccess(status: boolean): UpdateRapAccess {
  return {
    status,
    type: 'updateRapAccess',
  };
}
