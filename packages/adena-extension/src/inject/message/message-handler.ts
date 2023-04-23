import { HandlerMethod } from '.';
import { InjectionMessage, InjectionMessageInstance } from './message';
import { existsPopups } from './methods';
import { InjectCore } from './methods/core';

export class MessageHandler {
  public static createHandler = (
    message: InjectionMessage | any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: InjectionMessage | any) => void,
  ) => {
    try {
      if (message?.status) {
        const status = message?.status;
        switch (status) {
          case 'request':
            this.requestHandler(message, sender, sendResponse);
            break;
          case 'failure':
          case 'success':
            sendResponse(message);
            break;
          case 'common':
          case 'response':
          default:
            sendResponse(message);
            break;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  private static requestHandler = async (
    message: InjectionMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
  ) => {
    let existsWallet = false;
    try {
      const core = new InjectCore();
      const curreantAccount = await core.getCurrentAccount();
      existsWallet = curreantAccount?.getAddress('g') !== '';
    } catch (e) {
      existsWallet = false;
    }
    if (!existsWallet) {
      sendResponse(InjectionMessageInstance.failure('NO_ACCOUNT', message, message.key));
      return;
    }
    const isPopup = await existsPopups();
    if (isPopup) {
      sendResponse(
        InjectionMessageInstance.failure('UNRESOLVED_TRANSACTION_EXISTS', message, message.key),
      );
      return true;
    }
    switch (message.type) {
      case 'DO_CONTRACT':
        HandlerMethod.checkEstablished(message, sendResponse).then((isEstablished) => {
          if (isEstablished) {
            HandlerMethod.doContract(message, sendResponse);
          }
        });
        break;
      case 'GET_ACCOUNT':
        HandlerMethod.checkEstablished(message, sendResponse).then((isEstablished) => {
          if (isEstablished) {
            HandlerMethod.getAccount(message, sendResponse);
          }
        });
        break;
      case 'ADD_ESTABLISH':
        HandlerMethod.addEstablish(message, sendResponse);
        break;
      case 'SIGN_AMINO':
        HandlerMethod.checkEstablished(message, sendResponse).then((isEstablished) => {
          if (isEstablished) {
            HandlerMethod.signAmino(message, sendResponse);
          }
        });
        break;
      default:
        break;
    }
  };
}
