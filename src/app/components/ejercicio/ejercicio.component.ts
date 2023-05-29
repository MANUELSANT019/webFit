import { FormBuilder } from '@angular/forms';
import { EjercicioService } from '../../services/ejercicio.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-ejercicio',
  templateUrl: './ejercicio.component.html',
  styleUrls: ['./ejercicio.component.css']
})
export class EjercicioComponent {
  titlePage: string = 'Ejercicios';
  ejercicioList: any = [];
  ejercicioForm: any = this.formBuilder.group({
    nombreEjercicio: '',
    peso: 0,
    series: 0,
    repeticiones: 0,
    fecha: Date
  })
  editableEjercicio: boolean = false;
  idEjercicio: any;
  user = 'Usuario';


  constructor(private EjercicioService: EjercicioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {


  }
  ngOnInit() {
    this.getAllEjercicio();
  }


  getAllEjercicio() {
    this.EjercicioService.getAllEjerciciosData(localStorage.getItem('accessToken')).subscribe(
      (data: {}) => {
        this.ejercicioList = data
      }
    );
  }

  newEjercicioEntry() {
    this.EjercicioService.newEjercicio(localStorage.getItem('accessToken'), this.ejercicioForm.value).subscribe(
      () => {
        //Redirigiendo a la ruta actual /ejercicio y recargando la ventana
        this.router.navigate(['/ejercicio']).then(() => {
          this.newMessage('Registro exitoso');
        })
      }
    );
  }


  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  updateEjercicioEntry() {
    //Removiendo valores vacios del formulario de actualización
    for (let key in this.ejercicioForm.value) {
      if (this.ejercicioForm.value[key] === '') {
        this.ejercicioForm.removeControl(key);
      }
    }
    this.EjercicioService.updateEjercicio(localStorage.getItem('accessToken'), this.idEjercicio, this.ejercicioForm.value).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Ejercicio editado");
      }
    );
  }

  toggleEditEjercicio(id: any) {
    this.idEjercicio = id;
    console.log(this.idEjercicio)
    this.EjercicioService.getOneEjercicio(localStorage.getItem('accessToken'), id).subscribe(
      data => {
        this.ejercicioForm.setValue({
          nombreEjercicio: data.nombreEjercicio,
          peso: data.peso,
          series: data.series,
          fecha: this.getValidDate(data.fecha)
        });
      }
    );
    this.editableEjercicio = !this.editableEjercicio;
  }

  getValidDate(fecha: Date) {
    const fechaFinal: Date = new Date(fecha);
    //separado los datos
    var dd = fechaFinal.getDate() + 1;//fue necesario porque siempre daba un día antes
    var mm = fechaFinal.getMonth() + 1; //porque Enero es 0
    var yyyy = fechaFinal.getFullYear();
    var mes = '';
    var dia = '';

    //Como algunos meses tienen 31 días dd puede dar 32
    if (dd == 32) {
      dd = 1;
      mm++;
    }
    //Transformación de fecha cuando el día o mes son menores a 10
    //se le coloca un cero al inicio
    //Día
    if (dd < 10) {
      dia += `0${dd}`;
    } else {
      dia += `${dd}`;
    }
    //Mes
    if (mm < 10) {
      mes += `0${mm}`;
    } else {
      mes += `${mm}`;
    }
    //formatDate para colocar la fecha en un formato aceptado por el calendario
    //GMT-0500 es para Colombia
    var finalDate = formatDate(new Date(yyyy + '-' + mes + '-' + dia + ' GMT-0500'), 'yyyy-MM-dd', "en-US");
    return finalDate;
  }

  deleteEjercicioEntry(id: any) {
    console.log(id)
    this.EjercicioService.deleteEjercicio(localStorage.getItem('accessToken'), id).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Ejercicio eliminado");
      }
    );
  }
}
