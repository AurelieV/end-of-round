import {ProfileComponent} from './modules/user/profile.component'
import {TournamentData} from './model'
import {AngularFireDatabase} from 'angularfire2/database'
import {Observable} from 'rxjs/Observable'
import {ConnectionService} from './modules/user/connection.service'
import {Router, PRIMARY_OUTLET, NavigationEnd} from '@angular/router'
import {UserService} from './modules/user/user.service'
import {Component} from '@angular/core'
import {Subscription} from 'rxjs/Subscription'
import {MatDialog} from '@angular/material'

interface State {
  isOnDashboard: boolean
  isOnAdministration: boolean
  isOnTournament: boolean
  isOnHome: boolean
  isOnMainPage: boolean
  isOnCoverage: boolean
  isOnScorekeeper: boolean
  isOnLogin: boolean
  isOnMissingTables: boolean
  tournamentKey: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  state: State = {
    tournamentKey: '',
    isOnAdministration: false,
    isOnTournament: false,
    isOnHome: false,
    isOnDashboard: false,
    isOnMainPage: false,
    isOnCoverage: false,
    isOnScorekeeper: false,
    isOnLogin: false,
    isOnMissingTables: false,
  }
  subscriptions: Subscription[] = []
  title$: Observable<string>
  isStrongConnected$: Observable<boolean>

  constructor(
    private userService: UserService,
    private router: Router,
    public connectionService: ConnectionService,
    private db: AngularFireDatabase,
    private md: MatDialog
  ) {
    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.state = this.analyseState()
          this.setTitle()
        }
      })
    )
    this.title$ = Observable.of('')
    this.isStrongConnected$ = this.userService.user.map(
      (user) => user && !user.isAnonymous
    )
  }

  private analyseState(): State {
    let state = this.router.routerState.snapshot.root
    let params: any = {}
    const sections: string[] = []
    if (state.data.section) {
      sections.push(state.data.section)
    }
    while (state.children.length > 0) {
      state = state.children[0]
      if (state.data.section) {
        sections.push(state.data.section)
      }
      params = Object.assign(params, state.params)
    }
    const isOnEdit = sections.includes('Edition')

    return {
      isOnDashboard: sections.includes('Dashboard'),
      isOnAdministration: sections.includes('Administration'),
      isOnTournament: sections.includes('Tournament') || isOnEdit,
      isOnHome: sections.includes('TournamentList'),
      isOnMainPage: sections.includes('Home'),
      isOnCoverage: sections.includes('Coverage'),
      isOnScorekeeper: sections.includes('Scorekeeper'),
      isOnLogin: sections.includes('Login'),
      isOnMissingTables: sections.includes('Missing tables'),
      tournamentKey: params.tournamentKey,
    }
  }

  private setTitle() {
    if (this.state.isOnTournament) {
      this.title$ = this.db
        .object<TournamentData>(`/tournaments/${this.state.tournamentKey}`)
        .valueChanges<TournamentData>()
        .map((tournament) => tournament.name)
    } else if (this.state.isOnHome) {
      this.title$ = Observable.of('Select a tournament')
    } else if (this.state.isOnAdministration) {
      this.title$ = Observable.of('Administration')
    } else if (this.state.isOnLogin) {
      this.title$ = Observable.of('Login page')
    } else {
      this.title$ = Observable.of('')
    }
  }

  openProfile() {
    this.md.open(ProfileComponent)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }
}
