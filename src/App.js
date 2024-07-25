import './App.css';
import Task from './components/Task.js'
import TaskManager from './components/TaskManager.js'

const App = () => (
    <div className="App">
		<Task name='asdf' description='qwertyjsfd njsaaefjkadjk kjdfjnkgfjk jkgasjbksgfjklb njsadjkgadsjkb jasgjkgsdjkb'/>
		<TaskManager />
    </div>
);

export default App;