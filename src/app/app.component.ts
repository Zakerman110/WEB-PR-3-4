import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';

  tab : any = "tab2";
  tab1 : any
  tab2 : any

  onClick(check){
        if(check==1){
          this.tab = 'tab1';
        }else if(check==2){
          this.tab = 'tab2';
        }   
      
    }

    onSwitch(check){ 
      switch (check) {
       case 1:
         return 'tab1';
       case 2:
         return 'tab2';
     }
    }
}
