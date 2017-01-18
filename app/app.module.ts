import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent}  from './components/app/app.component';
import {SideInfoComponent}  from './components/app/sideinfo/sideinfo.component';
import {GraphworkspaceComponent}  from './components/graphworkspace/graphworkspace.component';
import {PlaneComponent}  from './components/plane/plane.component';

import {HttpModule} from '@angular/http'
import {SideInfoContentGraphsettingsComponent} from "./components/app/sideinfo/contentmodels/graphsettings.component";
import {InterGraphConnectionDirective} from "./components/graphworkspace/intergraphconnections/intergraphconnection.directive";
@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [AppComponent, GraphworkspaceComponent, PlaneComponent, SideInfoComponent, SideInfoContentGraphsettingsComponent, InterGraphConnectionDirective],
    bootstrap: [AppComponent]
})
/**
 * App Module loaded in main.ts
 */
export class AppModule {
}