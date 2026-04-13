import React, { useState } from 'react';

function Bissecao() {
    // 1. Estados para armazenar as entradas do usuário
    const [funcao, setFuncao] = useState('x**2 - 4');
    const [a, setA] = useState(0);
    const [b, setB] = useState(3);
    const [criterio, setCriterio] = useState(0.0001);

    // 2. Estados para armazenar a resposta do servidor
    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(false);

    // 3. Função para enviar os dados ao backend
    const handleCalcular = async () => {
        setCarregando(true);
        setErro(null);
        setResultado(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/calcular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    funcao: funcao, 
                    a: parseFloat(a), 
                    b: parseFloat(b), 
                    criterio: parseFloat(criterio) 
                }),
            });

            const data = await response.json();

            if (data.erro) {
                setErro(data.erro);
            } else {
                setResultado(data);
            }
        } catch (err) {
            setErro("Não foi possível conectar ao backend. O uvicorn está rodando?");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px' }}>
            <h2>Método da Bisseção</h2>

            {/* Inputs de Dados */}
            <div style={{ marginBottom: '10px' }}>
                <label>f(x): </label>
                <input type="text" value={funcao} onChange={(e) => setFuncao(e.target.value)} />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Limite a: </label>
                <input type="number" value={a} onChange={(e) => setA(e.target.value)} />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Limite b: </label>
                <input type="number" value={b} onChange={(e) => setB(e.target.value)} />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Critério (Erro): </label>
                <input type="number" step="0.0001" value={criterio} onChange={(e) => setCriterio(e.target.value)} />
            </div>

            <button onClick={handleCalcular} disabled={carregando}>
                {carregando ? 'Calculando...' : 'Calcular'}
            </button>

            <hr />

            {/* Exibição de Resultados ou Erros */}
            {erro && <p style={{ color: 'red' }}><strong>Erro:</strong> {erro}</p>}

            {resultado && (
                <div>
                    <h3>Resultado Encontrado:</h3>
                    <p><strong>Raiz aproximada:</strong> {resultado.raiz}</p>
                    <p><strong>Iterações:</strong> {resultado.total_iteracoes}</p>

                    <h4>Tabela de Iterações:</h4>
                    <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>i</th>
                                <th>Média (x)</th>
                                <th>f(x)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultado?.tabela?.map((item) => (
                                <tr key={item.iteracao}>
                                    <td>{item.iteracao}</td>
                                    <td>{item.media}</td>
                                    <td>{item.f_media}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Bissecao;