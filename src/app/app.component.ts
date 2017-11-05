import { ConnectionService } from './connection.service';
import { Router, PRIMARY_OUTLET, NavigationEnd } from '@angular/router';
import { UserService } from './user.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

interface State {
  isOnDashboard: boolean;
  isOnAdministration: boolean;
  isOnTournament: boolean;
  isOnHome: boolean;
  isOnMainPage: boolean;
  tournamentKey: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  state: State = {
    tournamentKey: '',
    isOnAdministration: false,
    isOnTournament: false,
    isOnHome: false,
    isOnDashboard: false,
    isOnMainPage: false
  }
  subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    public connectionService: ConnectionService
  ) {
    this.subscriptions.push(
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.state = this.analyseState();
            }
    }));
  }

  private analyseState(): State {
    let state = this.router.routerState.snapshot.root;
    let params: any = {};
    const componentNames: string[] = [];
    if (state.component) {
      componentNames.push(state.component['name'])
    }
    while (state.children.length > 0 ) {
      state = state.children[0];
      if (state.component) {
        componentNames.push(state.component['name'])
      }
      params = Object.assign(params, state.params);
    }
    const isOnEdit = componentNames.includes('CreateTournamentComponent') && params.id;

    return {
      isOnDashboard: componentNames.includes('DashboardComponent'),
      isOnAdministration: componentNames.includes('AdministrationComponent'),
      isOnTournament: componentNames.includes('TournamentComponent') || isOnEdit,
      isOnHome: componentNames.includes('TournamentListComponent'),
      isOnMainPage: componentNames.includes('HomeComponent'),
      tournamentKey: isOnEdit ? params.id : params.key
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
