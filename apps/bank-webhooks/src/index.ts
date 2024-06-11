import express from "express";
import prisma from "@repo/db/prisma";

const app = express();
app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
  const paymentInformation = {
    token: req.body?.token || "",
    userId: req.body?.userId || "",
    amount: req.body?.amount || "",
  };

  try {
    await prisma.$transaction([
      prisma.balance.update({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: paymentInformation.amount,
          },
        },
      }),

      prisma.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    res.status(200).json({
      message: "captured",
    });
  } catch (e) {
    console.log(e);

    await prisma.onRampTransaction.update({
      where: {
        token: paymentInformation.token,
      },
      data: {
        status: "Failure",
      },
    });

    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003, () => {
  "Listening on 3003";
});
