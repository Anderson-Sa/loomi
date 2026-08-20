import { LegalDisclaimer } from "@/components/LegalDisclaimer";

export const metadata = { title: "Política de privacidade — Loomi" };

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">Política de privacidade</h1>
      <LegalDisclaimer />

      <div className="space-y-6 text-sm leading-relaxed text-neutral-700">
        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            1. Quais dados coletamos
          </h2>
          <p>
            Coletamos os dados que você nos fornece ao fazer um pedido: nome, e-mail e endereço
            de entrega. O pagamento é processado diretamente pela Stripe, que coleta os dados do
            cartão — nós não temos acesso a essas informações.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            2. Para que usamos esses dados
          </h2>
          <p>
            Usamos seus dados para processar e entregar seu pedido, enviar a confirmação de
            compra por e-mail e, quando aplicável, para contato sobre trocas e devoluções.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            3. Com quem compartilhamos
          </h2>
          <p>
            Compartilhamos dados com a Stripe (processamento de pagamento) e, quando o pedido é
            enviado, com a transportadora responsável pela entrega. Não vendemos seus dados a
            terceiros.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            4. Seus direitos (LGPD)
          </h2>
          <p>
            Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode
            solicitar a qualquer momento: confirmação de que tratamos seus dados, acesso,
            correção, anonimização, portabilidade, eliminação dos dados ou revogação do
            consentimento. Para exercer esses direitos, entre em contato pelo e-mail{" "}
            <strong>[e-mail do encarregado de dados / DPO]</strong>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">5. Cookies</h2>
          <p>
            Usamos cookies essenciais para o funcionamento do carrinho de compras. Não utilizamos
            cookies de rastreamento publicitário neste momento.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">
            6. Alterações desta política
          </h2>
          <p>
            Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre
            disponível nesta página.
          </p>
        </section>
      </div>
    </div>
  );
}
