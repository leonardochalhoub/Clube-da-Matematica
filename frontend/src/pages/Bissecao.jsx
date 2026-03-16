function Bissecao() {
    return (

        <div>
            
            <h2>Método da Bisseção</h2>

            <div>
                <label>f(x): </label>
                <input type="text" placeholder="Digite a função" />
            </div>

            <div>
                <label>a: </label>
                <input type="number" />
            </div>

            <div>
                <label>b: </label>
                <input type="number" />
            </div>

            <button>Calcular</button> {/* Aqui depois vou fazer para enviar para o backend fazer o calculo */ }

        </div>
    );
}

export default Bissecao;