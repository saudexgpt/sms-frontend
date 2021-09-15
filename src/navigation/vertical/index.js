/*

Array of object

Top level object can be:
1. Header
2. Group (Group can have navItems as children)
3. navItem

* Supported Options

/--- Header ---/

header

/--- nav Grp ---/

title
icon (if it's on top level)
tag
tagVariant
children

/--- nav Item ---/

icon (if it's on top level)
title
route: [route_obj/route_name] (I have to resolve name somehow from the route obj)
tag
tagVariant

*/
import dashboard from './nav-modules/dashboard'
// import appsAndPages from './apps-and-pages'
import results from './nav-modules/result'
import adminSettings from './nav-modules/school-setup'
import appSetup from './nav-modules/app-setup'
import userManagement from './nav-modules/user-management'
// import others from './others'
// import chartsAndMaps from './charts-and-maps'
// import uiElements from './ui-elements'
// import formAndTable from './forms-and-table'

// Array of sections
export default [...dashboard, ...results, ...userManagement, ...adminSettings, ...appSetup]

// import store from '@/store'

// const Router = store.getters.permissionRoutes
// export default Router
