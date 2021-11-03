import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../../services/services";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {
  //Buscar o usuário no banco do Fauna com o ID CostumerId
  // Salvar os dados da subscription do usuario no FaunaDB

  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id_2"), customerId))
    )
  );

  console.log("UserRef", userRef);

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    // userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  await fauna.query(
    q.Create(q.Collection("subscriptions"), { data: subscriptionData })
  );
}
