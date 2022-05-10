<template>
    <div class="grid justify-content-center align-items-center">
        <div class="col-12">
            <div class="p-fluid formgrid grid text-center">
                <div class="field col-12 lg:col-4"></div>
                <div class="field col-12 lg:col-4">
                    <h1 style="color:#256029; font-size:300%; font-family: 'Oswald', sans-serif;">Datos estadísticos</h1>
                </div> 
                <div class="field col-12 md:col-4 mt-2">
                            <Dropdown id="usuarios" v-model="usuario" :options="selector_usuario" optionLabel="name" placeholder="Usuario" @change="aggregateComparativa(false);"></Dropdown>
                    </div>
            </div>
        </div>
        <div class="col-12 md:col-6">
            <div class="card">
                <div class= "p-fluid formgrid grid text-center">
                        <div class="field col-12 md:col-9 mt-2">
                            <h5>Comparativa macronutrientes ( {{tipo}} )</h5>
                        </div>
                        <div class="field col-12 md:col-3">
                                <Button label="Cambiar tipo" icon="pi pi-filter" class="p-button-success" @click="aggregateComparativa(true)"/>
                        </div>
                    </div>
                    <Chart type="bar" :data="barData" :options="barOptions" />
            </div>
        </div>
        <div class="col-12 md:col-6">
            <div class="card">
                <div class= "p-fluid formgrid grid text-center">
                        <div class="field col-12 md:col-9 mt-2">
                            <h5>Alimentos más consumidos ( {{tipo}} )</h5>
                        </div>

                        <div class="field col-12 md:col-3">
                                <Button label="Cambiar tipo" icon="pi pi-filter" class="p-button-success" @click="aggregateComparativa(true)"/>
                        </div>
                    </div>
                    <Chart type="bar" :data="barDataComidas" :options="barOptions" />
            </div>
        </div>      
    </div>
</template>

<script>
import unMes from '../../public/images/planes/plan_de_pago_1_mes.png';
import userService from '../service/UserService';
import AlimentoService from '../service/AlimentoService';
export default {
	data() {
        return {
            user: {nombre: ""},
            unMes: unMes,
            barData: {},
            tipo: "semanal",
            usuario: [],
            selector_usuario: [],
            barDataComidas: {}
            
        }
    },
    userService: null,
    created(){
        
        this.userService = new userService();
        this.alimentoService = new AlimentoService();
        this.aggregateComparativa();
        this.aggregateComidas();
        this.obtenerUser();
    },
    mounted(){
    },
    methods:{
        aggregateComidas(cambio){
            var tipoEnvio = "";
            if(this.tipo == "semanal" && cambio || this.tipo == "mensual" && !cambio){
                tipoEnvio = "mes"
            }else if(this.tipo == "semanal" && !cambio || this.tipo == "mensual" && cambio){
                tipoEnvio = "semana"
            }
			this.alimentoService.aggregateComidas(tipoEnvio).then(data =>{
                console.log(data);
                console.log("....",this.usuario.name)
                console.log("++++")
                if (this.usuario.name != undefined){
                    data = data.comparativa.filter(x=>x._id[0]._id == this.usuario.code)[0].alimentos
                }else{
                    data = data.comparativa[0].alimentos
                }
                this.barDataComidas = {
				labels: [data[0].alimento[0].nombre, data[1].alimento[0].nombre, data[2].alimento[0].nombre, data[3].alimento[0].nombre, data[4].alimento[0].nombre],
				datasets: [
					{
						label: 'gramos alimento consumidos',
						backgroundColor: '#2f4860',
						data: [data[0].cantidad, data[1].cantidad, data[2].cantidad, data[3].cantidad, data[4].cantidad]
					}
				]}
            })
		},
        aggregateComparativa(cambio){
            var tipoEnvio = "";
            if(this.tipo == "semanal" && cambio || this.tipo == "mensual" && !cambio){
                tipoEnvio = "mes"
            }else if(this.tipo == "semanal" && !cambio || this.tipo == "mensual" && cambio){
                tipoEnvio = "semana"
            }
			this.alimentoService.aggregateComparativa(tipoEnvio).then(data =>{
                this.selector_usuario = []
                for (var i=0; i<data.comparativa.length; i++){
                    this.selector_usuario.push({name: data.comparativa[i].usuario[0].nombre+" "+data.comparativa[i].usuario[0].apellidos, code: data.comparativa[i]._id})
                }
                if (data.tipo == "semana"){
                    this.tipo = "semanal";
                }else{
                    this.tipo = "mensual"
                }
                this.alimentoService.mapReduce(tipoEnvio).then(dataMapReduce =>{

                    if (this.usuario.name != undefined){
                        data = data.comparativa.filter(x=>x._id == this.usuario.code)[0]
                        dataMapReduce = dataMapReduce.results.filter(x=>x._id == this.usuario.code)[0]
                    }else{
                        data = data.comparativa[0]
                        this.usuario = this.selector_usuario.filter(x=>x.code==data._id)[0]
                        dataMapReduce = dataMapReduce.results.filter(x=>x._id == this.usuario.code)[0]
                        console.log(dataMapReduce);
                    }
                    
                    this.barData = {
                    labels: ['kcal', 'proteínas', 'carbohidratos', 'grasas'],
                    datasets: [
                        {
                            label: 'Recomendadas',
                            backgroundColor: '#2f4860',
                            data: [data.kcalRecomendadas, data.proteinasRecomendadas, data.carbRecomendadas, data.grasasRecomendadas]
                        },
                        {
                            label: 'Consumidas',
                            backgroundColor: '#00bb7e',
                            data: [data.kcalConsumidas, data.proteinasConsumidas, data.carbConsumidas, data.grasasConsumidas]
                        },
                        {
                            label: 'Diferencia',
                            backgroundColor: '#42A5F5',
                            data: [dataMapReduce.value.kcal, dataMapReduce.value.proteinas, dataMapReduce.value.carb, dataMapReduce.value.grasas]
                        }
                    ]}
                    this.aggregateComidas(cambio);
                
                })
            })
		},
        obtenerUser(){
            function calcularEdad(fechaNacimiento) {
            var hoy = new Date();
            var cumpleanos = new Date(fechaNacimiento);
            var edad = hoy.getFullYear() - cumpleanos.getFullYear();
            var m = hoy.getMonth() - cumpleanos.getMonth();
        
            if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
                edad--;
            }
        
            return edad;
        }
            this.userService.getUser(this.$store.state.username).then(data => {
                this.user = data;
                this.user.edad = calcularEdad(this.user.fechaNacimiento)
                console.log(this.user)
            });
        }
    },
}
</script>