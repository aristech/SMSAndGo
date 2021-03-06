import { Component } from '@angular/core';

import { Platform, AlertController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { MainService } from './services/main/main.service';
import { AnalyticsFirebase } from '@ionic-native/analytics-firebase';
import { Router } from '@angular/router';
import { Market } from '@ionic-native/market/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private selectLang: string = 'el';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public translate: TranslateService,
    public alertController: AlertController,
    public mainService: MainService,
    private router: Router,
    private menu: MenuController,
    private market: Market
  ) {
    
    //this.translate.setDefaultLang('el');
    //this.translate.currentLang = this.mainService.getDefauldLang();  
    this.selectLang = this.mainService.getDefauldLang();
    console.log(this.selectLang);
    
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.platform.backButton.subscribe(async () => {
        if (this.router.isActive('/home', true) && this.router.url === '/home') {
          navigator['app'].exitApp();
        }
      });
      await AnalyticsFirebase.setMinimumSessionDuration(500).catch(() => {
        //AnalyticsFirebase.resetAnalyticsData()
      })
      await AnalyticsFirebase.logEvent(AnalyticsFirebase.DEFAULT_EVENTS.APP_OPEN).catch(() => {
        //AnalyticsFirebase.resetAnalyticsData()
      })
      this.statusBar.show();
      this.splashScreen.hide();
    })
  }
  ionViewDidLeave() {
  }

  useLanguage(language: string) {    
    this.mainService.setDefauldLang(language).then(data => {
      this.translate.use(language);
      this.translate.currentLang = language;
    })
  }

  onOpenPersonalSettings() {
    this.menu.close();
    this.router.navigate(['editpersonalsettings'])
  }

  onOpenEditImages() {
    this.menu.close();
    this.router.navigate(['editimage'])
  }

  onOpenStats() {
    this.menu.close();
    this.router.navigate(['stats'])
  }

  clearAppData() {
    this.mainService.clearAll();
  }

  async onRateApp() {
    await AnalyticsFirebase.logEvent('Rate_us').catch(() => {
    })
    this.market.open('io.smsngo.starter');

  }
}
