import { Routes } from '@angular/router';
import { DispositivosListComponent } from './dispositivo/dispositivos-list/dispositivos-list.component';
import { DispositivosComponent } from './dispositivo/dispositivos/dispositivos.component';
import { MotoristasComponent } from './motorista/motoristas/motoristas.component';
import { MotoristasListComponent } from './motorista/motoristas-list/motoristas-list.component';
import { VeiculosListComponent } from './veiculo/veiculos-list/veiculos-list.component';
import { VeiculosComponent } from './veiculo/veiculos/veiculos.component';
import { EntregasComponent } from './entrega/entregas/entregas.component';
import { EntregasListComponent } from './entrega/entregas-list/entregas-list.component';
import { MonitoramentoComponent } from './monitoramento/monitoramento.component';
import { TrajetosComponent } from './trajeto/trajetos/trajetos.component';
import { TrajetosListComponent } from './trajeto/trajetos-list/trajetos-list.component';
import { EmpresasListComponent } from './empresa/empresas-list/empresas-list.component';
import { EmpresasComponent } from './empresa/empresas/empresas.component';
import { ObrasListComponent } from './obra/obras-list/obras-list.component';
import { ObrasComponent } from './obra/obras/obras.component';
import { ContratosListComponent } from './contrato/contratos-list/contratos-list.component';
import { ContratosComponent } from './contrato/contratos/contratos.component';
import { ClientesListComponent } from './cliente/clientes-list/clientes-list.component';
import { ClientesComponent } from './cliente/clientes/clientes.component';

export const routes: Routes = [
    { path: 'dispositivos', component: DispositivosListComponent },
    { path: 'dispositivos/novo', component: DispositivosComponent },
    { path: 'dispositivos/:numeroInterno', component: DispositivosComponent },
    { path: 'dispositivos/editar/:numeroInterno', component: DispositivosComponent },

    { path: 'motoristas', component: MotoristasListComponent },
    { path: 'motoristas/novo', component: MotoristasComponent },
    { path: 'motoristas/:id', component: MotoristasComponent },
    { path: 'motoristas/editar/:id', component: MotoristasComponent },
    
    { path: 'veiculos', component: VeiculosListComponent },
    { path: 'veiculos/novo', component: VeiculosComponent },
    { path: 'veiculos/:id', component: VeiculosComponent },
    { path: 'veiculos/editar/:id', component: VeiculosComponent },

    { path: 'entregas', component: EntregasListComponent },
    { path: 'entregas/novo', component: EntregasComponent },
    { path: 'entregas/:id', component: EntregasComponent },
    { path: 'entregas/editar/:id', component: EntregasComponent },

    { path: 'monitoramento', component: MonitoramentoComponent },
    { path: 'trajetos', component: TrajetosListComponent },
    { path: 'trajetos/:id', component: TrajetosComponent },

    { path: 'empresas', component: EmpresasListComponent },
    { path: 'empresas/novo', component: EmpresasComponent },
    { path: 'empresas/:codigo', component: EmpresasComponent },
    { path: 'empresas/editar/:codigo', component: EmpresasComponent },

    { path: 'obras', component: ObrasListComponent },
    { path: 'obras/novo', component: ObrasComponent },
    { path: 'obras/:id', component: ObrasComponent },
    { path: 'obras/editar/:id', component: ObrasComponent },

    { path: 'contratos', component: ContratosListComponent },
    { path: 'contratos/novo', component: ContratosComponent },
    { path: 'contratos/:id', component: ContratosComponent },
    { path: 'contratos/editar/:id', component: ContratosComponent },

    { path: 'clientes', component: ClientesListComponent },
    { path: 'clientes/novo', component: ClientesComponent },
    { path: 'clientes/:id', component: ClientesComponent },
    { path: 'clientes/editar/:id', component: ClientesComponent },
];
