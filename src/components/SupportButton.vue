 <template>
    <div>
        <Toast/>
        <div class="support">
            <Button @click="openResponsive" icon="pi pi-exclamation-circle" class="p-button-rounded p-button-success soporte" />
        </div>
        <div>
        <Dialog header="¿Quiéres enviarnos una incidencia?" v-model:visible="displayResponsive" :breakpoints="{'960px': '75vw'}" :style="{width: '50vw'}">
            <div class="grid justify-content-center align-items-center">
                <div class="col-12">
                    <h4>Título</h4>
                    <InputText type="text" v-model="title" class="p-inputtext-lg col-12" />
                </div>
                <div class="col">
                    <h4>Cuerpo</h4>
                    <Textarea v-model="body" :autoResize="true" rows="5" class="col-12"/>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" @click="closeResponsive" autofocus style="background-color:#1DA750; color:white;" />
                <Button label="Enviar" icon="pi pi-check" @click="enviarIssue"  style="background-color:#1DA750; color:white;"/>
            </template>
        </Dialog>
        </div>
    </div>
</template>

<script>

require("dotenv").config();
const fetch= require("node-fetch")
export default {
	data() {
		return {
            title: '',
            body:"",
            displayResponsive: false,
        }
    },    
	methods: {
        openResponsive() {
            this.displayResponsive = true;
        },
        closeResponsive() {
            this.displayResponsive = false;
        },
        enviarIssue(){
            var user=this.$store.state.username
            const url=process.env.VUE_APP_GITAPIURL
            const token= process.env.VUE_APP_GITTOKEN
            var bod = this.body
            if(user){
                bod += (" - " +user)
            }
            var json= JSON.stringify({
                "title":this.title,
                "body":bod,
                "labels": [
                    "client attendant"
                    ]
                })
            fetch(url,{
                method:"post",
                body: json,
                headers: {'Content-Type': 'application/json', 'Authorization': `${token}`}
            }).then(()=>{
                this.closeResponsive()
                this.title=""
                this.body=""
                this.$toast.add({severity:'success', summary: 'Incidencia', detail: 'Incidencia enviada con éxito', life: 3000});
            })
        }
    },
    components: {

    }
}
</script>
<style>
.support{
    position: fixed;
    bottom: 5%;
    right: 5%;
    z-index: 30;
}

.soporte:hover {
    transform: scale(1.5);
    transition: 0.5s;
}
</style>
