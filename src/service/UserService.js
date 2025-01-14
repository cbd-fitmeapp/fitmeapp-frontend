import axios from 'axios';

export default class UserService {

    getUsers() {
        return axios.get('/users')
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    saveUser(user) {
        return axios.post('/users/', user);
    }
    
    getSuscripcion(userId){
        return axios.get(`/users/suscripcion/${userId}`)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    getUser(username){
        return axios.get(`/users/${username}`)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    guardar(user){
        return axios.post(`auth/register/`,user)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    actualizar(userId,user){
        return axios.put(`users/${userId}`,user)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    actualizarNutrientes(user){
        var corrector_actividad = 1.2
        var tmb = 0
        if(user.nivel_actividad == "Ejercicio Ligero"){
            corrector_actividad = 1.375
        }else if(user.nivel_actividad == "Ejercicio moderado"){
            corrector_actividad = 1.55
        }else if(user.nivel_actividad == "Ejercicio fuerte"){
            corrector_actividad = 1.725
        }else if(user.nivel_actividad == "Ejercicio muy fuerte"){
            corrector_actividad = 1.9
        }

        if (user.sexo == "Masculino"){
            tmb = 66 + (13.7 * user.peso_actual) + (5 * user.altura) - (6.75 * calcularEdad(user.fechaNacimiento))
            tmb *= corrector_actividad  
            if(user.objetivo == "Perder peso" || user.objetivo == "Aumentar masa muscular"){
                tmb += user.objetivo_semanal * 1000
            }
        }else{
            tmb = 665 + (9.6 * user.peso_actual) + (1.8 * user.altura) - (4.7 * calcularEdad(user.fechaNacimiento))
            tmb *= corrector_actividad  
            if(user.objetivo == "Perder peso" || user.objetivo == "Aumentar masa muscular"){
                tmb += user.objetivo_semanal * 1600
            }
        }

        if(tmb > 1200)  {
            user.kcal_recomendadas = tmb
        }else{
            user.kcal_recomendadas = 1200
        }

        if(user.dieta_pref == "Estándar"){
            user.carbohidratos_recomendados = user.kcal_recomendadas * 0.5
            user.proteinas_recomendadas = user.kcal_recomendadas * 0.2
            user.grasas_recomendadas = user.kcal_recomendadas * 0.3
        }else if(user.dieta_pref == "Baja en carbohidratos"){
            user.carbohidratos_recomendados = user.kcal_recomendadas * 0.3
            user.proteinas_recomendadas = user.kcal_recomendadas * 0.25
            user.grasas_recomendadas = user.kcal_recomendadas * 0.45
        }else if(user.dieta_pref == "Alta en proteínas"){
            user.carbohidratos_recomendados = user.kcal_recomendadas * 0.35
            user.proteinas_recomendadas = user.kcal_recomendadas * 0.4
            user.grasas_recomendadas = user.kcal_recomendadas * 0.25
        }else if(user.dieta_pref == "Baja en grasas"){
            user.carbohidratos_recomendados = user.kcal_recomendadas * 0.55
            user.proteinas_recomendadas = user.kcal_recomendadas * 0.2
            user.grasas_recomendadas = user.kcal_recomendadas * 0.25
        }

        user.kcal_recomendadas = Math.trunc(user.kcal_recomendadas)
        user.carbohidratos_recomendados = Math.trunc(user.carbohidratos_recomendados)
        user.proteinas_recomendadas = Math.trunc(user.proteinas_recomendadas)
        user.grasas_recomendadas = Math.trunc(user.grasas_recomendadas)

        return user

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
    }

    getFavoritos(userId){
        return axios.get(`/users/favoritos/${userId}`)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });            
    }

    postFavoritos(userId, alimentoId){
        return axios.post(`users/favoritos/${userId}/${alimentoId}`)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });         
    }

    deleteFavoritos(userId, alimentoId){
        return axios.delete(`users/favoritos/${userId}/${alimentoId}`)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });         
    }
  
    deleteUser(userID){
        return axios.delete(`/users/${userID}`)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    savePeso(peso, userId, diaId){
        return axios.put('/users/peso/' + peso+"/"+ userId+ "/"+diaId);
    }

    saveAgua(agua, diaId){
        return axios.put('/users/agua/' + agua+"/"+diaId);
    }
}