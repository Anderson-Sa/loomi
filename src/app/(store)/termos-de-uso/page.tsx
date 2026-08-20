import { LegalDisclaimer } from "@/components/LegalDisclaimer";

export const metadata = { title: "Termos de uso — Loomi" };

export default function TermosDeUsoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">Termos de uso</h1>
      <LegalDisclaimer />

      <div className="space-y-6 text-sm leading-relaxed text-neutral-700">
        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">1. Sobre a Loomi</h2>
          <p>
            Este site é operado por <strong>[Razão Social]</strong>, inscrita no CNPJ sob o nº{" "}
            <strong>[CNPJ]</strong>, com sede em <strong>[endereço completo]</strong>. Ao usar
            este site, você concorda com os termos descritos abaixo.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            2. Cadastro e pedidos
          </h2>
          <p>
            Você é responsável por fornecer informações verdadeiras e atualizadas ao finalizar
            uma compra (nome, e-mail e endereço de entrega). Reservamo-nos o direito de recusar
            ou cancelar pedidos em caso de suspeita de fraude, indisponibilidade de estoque ou
            erro evidente de preço.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            3. Preços e pagamento
          </h2>
          <p>
            Os preços exibidos estão em reais (R$) e podem ser alterados sem aviso prévio, exceto
            para pedidos já confirmados. O pagamento é processado com segurança pela Stripe; não
            armazenamos dados do seu cartão em nossos servidores.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            4. Trocas e devoluções
          </h2>
          <p>
            As condições de troca e devolução estão descritas na nossa{" "}
            <a href="/trocas-e-devolucoes" className="text-brand hover:underline">
              página de trocas e devoluções
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            5. Propriedade intelectual
          </h2>
          <p>
            Marca, logotipo, textos e imagens deste site são de propriedade da Loomi ou de seus
            licenciadores, sendo proibida a reprodução sem autorização prévia.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            6. Limitação de responsabilidade
          </h2>
          <p>
            Fazemos o possível para manter as informações do site precisas, mas não garantimos
            que o site estará livre de erros ou interrupções. Nossa responsabilidade se limita ao
            valor efetivamente pago pelo produto, nos termos da legislação aplicável.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            7. Alterações e legislação aplicável
          </h2>
          <p>
            Estes termos podem ser atualizados a qualquer momento. Eles são regidos pela
            legislação brasileira, com foro eleito na comarca de{" "}
            <strong>[cidade/UF]</strong> para dirimir eventuais controvérsias.
          </p>
        </section>
      </div>
    </div>
  );
}
