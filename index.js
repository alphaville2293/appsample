const db = firebase.firestore();

const taskform = document.getElementById('task-form');
const taskcontainer = document.getElementById('tasks-container');
let editstatus =false;
let id= '';
const savetask = (unidad, pregunta) =>
    db.collection('Preguntas').doc().set({
        unidad,
        pregunta
    });

const gettask = ()=>db.collection('Preguntas').get();
const getTask = (id)=>db.collection('Preguntas').doc(id).get();
const ongettask = (callback) =>db.collection('Preguntas').onSnapshot(callback);
const deletetask = id => db.collection('Preguntas').doc(id).delete();
const updatetask = (id, updatedtask)=>db.collection('Preguntas').doc(id).update(updatedtask); 
window.addEventListener('DOMContentLoaded', async(e)=>{
    ongettask((querySnapshot)=>{
        taskcontainer.innerHTML = " "  ;
        querySnapshot.forEach((doc) => {
            const task = doc.data();
            task.id=doc.id;  
            taskcontainer.innerHTML += "<div class='card card-body mt-2 border-primary'>" + "<h3 class='h5'>" + task.unidad + "</h3>"+ "<p>" + task.pregunta + "</p>" + "<div><button class='btn btn-primary btn-delete'  data-id= " + task.id +">Eliminar</buttom><button class='btn btn-secondary btn-edit' data-id="+ task.id +">Editar</buttom></div>"+"</div>"
            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) =>{
                    await deletetask(e.target.dataset.id)
                })
            })
            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async(e)=>{
                    const doc = await getTask(e.target.dataset.id);
                    const task = doc.data();
                    editstatus =true;
                    id=doc.id;
                    taskform['unidad'].value= task.unidad;
                    taskform['pregunta'].value=task.pregunta;
                    taskform['btn-task-form'].innerHTML = 'Actualizar';

                })
            })
        })
    })
}) 

taskform.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const unidad = taskform['unidad'];
    const pregunta = taskform['pregunta'];
    if (!editstatus){
        await savetask (unidad.value, pregunta.value);
    }else{
        await updatetask(id, {
            unidad : unidad.value,
            pregunta:pregunta.value
        });
        editstatus =false;
        id='';
        taskform['btn-task-form'].innerText = 'Guardar'; 
    }
    await gettask();
    taskform.reset();
    title.focus();
})
 