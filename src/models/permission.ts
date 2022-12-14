export type ServiceType =
  | 'article'
  | 'winner'
  | 'pin'
  | 'event'
  | 'item'
  | 'reward'
  | 'hashtag'
  | 'hashtag-ranking'
  | 'management-follower'
  | 'sources'
  | 'user';

export type BookingServices = 'flight' | 'hotel';

export type PermissionType =
  | 'view'
  | 'add'
  | 'edit'
  | 'delete'
  | 'viewDetail'
  | 'updateStore'
  | 'active';

export interface Role {
  module: ServiceType;
  role: PermissionType[];
}
export interface RoutesTabType {
  name: ServiceType | string; // key of module
  title?: string; // string id of title breadcrumb sidebar helmet
  path?: string; // path link
  module?: string; // path link
  component?: any;
  isModule?: boolean; // is highest page
  hidden?: boolean;
  hiddenMenu?: RoutesTabType[];
  subMenu?: RoutesTabType[];
  backStep?: number;
  exact?: boolean;
  listRole?: Role[];
  noStickyHeader?: boolean;
  disableInBreadcrumb?: boolean;
  disableBreadcrumb?: boolean;
  subName?: string;
}
