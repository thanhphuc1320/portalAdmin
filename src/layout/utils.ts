import { ROUTES_TAB } from '../configs/routes';
import { some } from '../constants';
import { Role, RoutesTabType, PermissionType } from '../models/permission';

export function flatRoutes(list: RoutesTabType[]): RoutesTabType[] {
  let listTerm: RoutesTabType[] = [];
  list.forEach(route => {
    if (route.subMenu) {
      listTerm = listTerm.concat(flatRoutes(route.subMenu));
    }
    if (route.hiddenMenu) {
      listTerm = listTerm.concat(flatRoutes(route.hiddenMenu));
    }
    if (route.path) {
      listTerm = listTerm.concat(route);
    }
  });
  return listTerm;
}

function getMapRelationsRoutes(list: RoutesTabType[], hashMap: some[], parent?: RoutesTabType) {
  list.forEach(route => {
    if (route.component) {
      hashMap.push({ child: route, parent: route });
    }
    if (parent) {
      hashMap.push({ child: route, parent });
    }
    if (route.subMenu) {
      getMapRelationsRoutes(route.subMenu, hashMap, route);
    }
    if (route.hiddenMenu) {
      getMapRelationsRoutes(route.hiddenMenu, hashMap, route);
    }
  });
}

function getParentHistoryPath(list: RoutesTabType[], hashMap: some[], pathName: string) {
  hashMap.forEach((obj: some) => {
    const isConstant = list.findIndex(one => one?.name === obj.parent?.name);
    if (obj.child.path === pathName && isConstant === -1) {
      list.push(obj.parent);
      if (!obj.parent.isModule) {
        getParentHistoryPath(list, hashMap, obj.parent?.path);
      }
    }
  });
}
function getChildHistoryPath(list: RoutesTabType[], hashMap: some[], pathName: string) {
  hashMap.forEach((obj: some) => {
    const isConstant = list.findIndex(one => one?.name === obj.child?.name);
    if (obj.parent.path === pathName && isConstant === -1) {
      list.push(obj.child);
      getChildHistoryPath(list, hashMap, obj.child?.path);
    }
  });
}
export function getListRoutesContain(list: RoutesTabType[], pathName: string): some[] {
  let listRouter: RoutesTabType[] = [];
  const hashMap: some[] = [];
  getMapRelationsRoutes(list, hashMap);
  getParentHistoryPath(listRouter, hashMap, pathName);
  listRouter = listRouter
    .filter((route: RoutesTabType) => route.disableInBreadcrumb !== true)
    .map((route: RoutesTabType, index: number) => {
      return { ...route, backStep: index };
    })
    .reverse();
  return listRouter;
}

export function getAllRoutesContain(list: RoutesTabType[], pathName: string): some[] {
  let listRouter: RoutesTabType[] = [];
  const hashMap: some[] = [];
  getMapRelationsRoutes(list, hashMap);
  getParentHistoryPath(listRouter, hashMap, pathName);
  listRouter = listRouter
    .filter((route: RoutesTabType) => route.disableInBreadcrumb !== true)
    .map((route: RoutesTabType, index: number) => {
      return { ...route, backStep: index };
    })
    .reverse();
  getChildHistoryPath(listRouter, hashMap, pathName);
  listRouter = listRouter
    .reverse()
    .filter((route: RoutesTabType) => route.disableInBreadcrumb !== true);
  return listRouter.reverse();
}

export function getCurrentRoute(pathName: string, listRouter: RoutesTabType[]) {
  const listRoutes = flatRoutes(listRouter);
  return listRoutes.find((route: RoutesTabType) => route.path === pathName);
}

/* ---------------Permission--------------*/
export function hasPermission(routePermission: some, listRole?: Role[]) {
  // return true;
  // let check = true;
  listRole &&
    listRole.forEach((role: Role) => {
      let count = 0;
      role?.role.forEach((per: PermissionType) => {
        if (routePermission?.[`${role.module}`]?.listFeature?.[`${per}`]?.isActive === true) {
          count += 1;
        }
      });
      if (count !== role?.role?.length) {
        // check = false;
      }
    });
  // return check;
  return true;
}

export function getListRoutesActivate(routePermission: some, listRoutes: RoutesTabType[]) {
  const list: RoutesTabType[] = [];
  listRoutes &&
    listRoutes.forEach((route: RoutesTabType) => {
      if (route.path) {
        if (route.listRole) {
          if (hasPermission(routePermission, route.listRole)) {
            list.push(route);
          }
        } else {
          list.push(route);
        }
      }
    });
  return list;
}

export function getCurrentRole(routePermission: some[], roles?: Role[] | string) {
  const listRouteActive = flatRoutes([...ROUTES_TAB]);
  if (roles) {
    if (typeof roles === 'string') {
      const currentRoute = listRouteActive.find(v => v.path === roles);
      return hasPermission(routePermission, currentRoute?.listRole);
    }
    return hasPermission(routePermission, roles);
  }
  return true;
}
