import "../../app.css"
const Feedback = ({ enviar, cerrar }) => {

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                <div className="bg-white p-5 border-primary1 w-8/10">
                    <h2 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-2 mb-2">Retroalimentación</h2>
                    <div></div>
                    <label className="w-9/10 m-auto block">Máximo N caracteres.</label>
                    <textarea name="" id="" placeholder="Retroalimentación" className="w-9/10 m-auto block text-2xl p-2 resize-none h-32 bg-neutral-300"></textarea>
                    <div className="flex justify-center mt-6 gap-4">
                        <button className="text-white text-2xl py-2 px-6 rounded-2xl bg-primary2"
                            onClick={enviar}>Enviar</button>
                        <button className="text-white text-2xl py-2 px-6 rounded-2xl bg-alt1"
                            onClick={cerrar}>Cancelar</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Feedback;