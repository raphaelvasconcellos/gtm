import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Usuario } from '../shared/usuario.model';
import { NgForm } from '@angular/forms';
import { MensagemUtil } from 'src/app/util/mensagem-util';
import { UsuarioService } from '../shared/usuario.service';
import { MessageService, SelectItem } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuario-novo',
  templateUrl: './usuario-novo.component.html',
  styleUrls: ['./usuario-novo.component.scss']
})
export class UsuarioNovoComponent implements OnInit {

  titulo = 'Novo Usuário'

  form: Usuario;
  confirmacaoSenhaValida: boolean;

  perfis: SelectItem[] = [
    {label: 'Administrador', value: 'Administrador'},
    {label: 'Normal', value: 'Normal'},
  ]

  constructor(private usuarioService: UsuarioService, private messageService: MessageService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        const id = params['id'];
        this.usuarioService.buscarPorId(id).subscribe((usuario: Usuario) => {
          this.form = usuario;
        }, (respostaErro) => this.messageService.add(MensagemUtil.criaMensagemErro(respostaErro.error.errors[0].msg)))
      }
    })
  }

  salvar(form: NgForm) {
    if(this.formularioInvalido(form)) {      
      this.messageService.add(MensagemUtil.criaMensagemErro(MensagemUtil.FORMULARIO_INVALIDO));
      return;
    }
    this.usuarioService.insereUsuario(form.value).subscribe(() => {
      this.messageService.add(MensagemUtil.criaMensagemSucesso(MensagemUtil.REGISTRO_SALVO));
      this.voltar();
    }, () => this.messageService.add(MensagemUtil.criaMensagemErro(MensagemUtil.ERRO_SALVAR)));
  }

  formularioInvalido(form: NgForm) {
    let formularioInvalido: boolean = false;
    if(form.invalid || !this.confirmacaoSenhaValida) {
      formularioInvalido = true;
    }
    return formularioInvalido;
  }

  validaConfirmacaoSenha(form: NgForm) {
    if(form.controls.senha.value == form.controls.confSenha.value) {
      this.confirmacaoSenhaValida = true;
    } else {
      this.confirmacaoSenhaValida = false;
    }
  }

  voltar() {
    this.router.navigate(['usuario']);
  }

}
