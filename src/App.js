import { useState, useEffect } from 'react';
import { bancodedados, auth } from './firebaseConnection';
import { doc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Button, TextField, List, ListItem, Checkbox, ListItemText } from '@mui/material'; // Importar Material-UI

function App() {
  const [descricao, setDescricao] = useState('');
  const [idTarefa, setIdTarefa] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tarefas, setTarefas] = useState([]);
  const [usuario, setUsuario] = useState(false);
  const [detalhesUsuario, setDetalhesUsuario] = useState({});

  useEffect(() => {
    async function carregarTarefas() {
      onSnapshot(collection(bancodedados, 'tarefas'), (snapshot) => {
        let listaTarefas = [];
        snapshot.forEach((doc) => {
          listaTarefas.push({
            id: doc.id,
            descricao: doc.data().descricao,
            completed: doc.data().completed,
          });
        });
        setTarefas(listaTarefas);
      });
    }
    carregarTarefas();
  }, []);

  useEffect(() => {
    async function verificarLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUsuario(true);
          setDetalhesUsuario({ uid: user.uid, email: user.email });
        } else {
          setUsuario(false);
          setDetalhesUsuario({});
        }
      });
    }
    verificarLogin();
  }, []);

  async function novousuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert('Usuário cadastrado com sucesso!!');
        setEmail('');
        setSenha('');
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert('Senha muito fraca');
        } else if (error.code === 'auth/email-already-in-use') {
          alert('Email já cadastrado!');
        }
      });
  }

  async function logarusuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        alert('Usuário logado com sucesso!');
        setUsuario(true);
        setDetalhesUsuario({ uid: value.user.uid, email: value.user.email });
        setEmail('');
        setSenha('');
      })
      .catch(() => {
        alert('Erro ao fazer login');
      });
  }

  async function fazerLogout() {
    await signOut(auth);
    setUsuario(false);
    setDetalhesUsuario({});
  }

  // C - Create
  async function adicionarTarefa() {
    await addDoc(collection(bancodedados, 'tarefas'), {
      descricao: descricao,
      completed: false
    })
      .then(() => {
        alert('Tarefa adicionada com sucesso!');
        setDescricao('');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // U - Update
  async function editarTarefa() {
    const tarefaEditada = doc(bancodedados, 'tarefas', idTarefa);
    await updateDoc(tarefaEditada, { descricao: descricao })
      .then(() => {
        alert('Tarefa editada com sucesso!');
        setIdTarefa('');
        setDescricao('');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Marcar como completa/incompleta
  async function toggleTarefa(id, completed) {
    const tarefa = doc(bancodedados, 'tarefas', id);
    await updateDoc(tarefa, { completed: !completed });
  }

  // D - Delete
  async function excluirTarefa(id) {
    const tarefaDeletada = doc(bancodedados, 'tarefas', id);
    await deleteDoc(tarefaDeletada)
      .then(() => {
        alert('Tarefa deletada com sucesso!');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <h1>Lista de Tarefas</h1>

      {usuario && (
        <div>
          <strong>Seja bem-vindo(a), {detalhesUsuario.email}</strong>
          <Button variant="contained" onClick={fazerLogout}>Sair</Button>
        </div>
      )}

      {!usuario && (
        <div>
          <h2>Autenticação</h2>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button variant="contained" onClick={novousuario}>Cadastrar</Button>
          <Button variant="contained" onClick={logarusuario}>Login</Button>
        </div>
      )}

      {usuario && (
        <>
          <h2>Adicionar Tarefa</h2>
          <TextField
            label="Descrição da tarefa"
            variant="outlined"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <Button variant="contained" onClick={adicionarTarefa}>Inserir</Button>

          <h2>Tarefas</h2>
          <List>
            {tarefas.map((tarefa) => (
              <ListItem key={tarefa.id}>
                <Checkbox
                  checked={tarefa.completed}
                  onChange={() => toggleTarefa(tarefa.id, tarefa.completed)}
                />
                <ListItemText primary={tarefa.descricao} />
                <Button variant="contained" onClick={() => excluirTarefa(tarefa.id)}>Deletar</Button>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </div>
  );
}

export default App;
