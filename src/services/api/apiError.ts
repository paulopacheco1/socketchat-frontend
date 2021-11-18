import React, { useCallback } from 'react';
// import { AxiosError } from 'axios';
import { FormHandles } from '@unform/core';

import { useToast } from '../../contexts';
import { IToast } from '../../components/Toast';

export class ApiError extends Error {
  public readonly statusCode: string;

  public toasts: Omit<IToast, 'id'>[] = [];

  public readonly formErrors: { [key: string]: string };

  public readonly type:
    | 'Validation Error'
    | 'Application Exception'
    | 'Internal Server Error'
    | 'Network Error';

  constructor(error: any) { // eslint-disable-line
    super(error.message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);

    if (error.response) {
      this.type = error.response.data.Type;
      this.statusCode = error.response.data.StatusCode;
    } else if (error.message === 'Network Error') {
      this.type = 'Network Error';
    }

    if (error?.response?.data?.Fields) {
      this.formErrors = {};

      error.response.data.Fields.forEach(field => {
        const fieldName = `${field.Field[0].toLowerCase()}${field.Field.substring(
          1,
        )}`;

        [this.formErrors[fieldName]] = field.Errors;
      });
    }

    switch (this.type) {
      case 'Network Error':
        this.toasts.push({
          title: 'Falha de comunicação com o servidor',
          description:
            'Ocorreu um erro ao tentar se comunicar com o servidor. Verifique sua conexão e tente novamente mais tarde.',
          type: 'error',
        });
        break;

      case 'Validation Error':
        this.toasts.push({
          title: 'Ocorreu um erro...',
          description: error.response.data.Message,
          type: 'error',
        });
        break;

      case 'Application Exception':
        this.toasts.push({
          title: 'Ocorreu um erro...',
          description: error.response.data.Message,
          type: 'error',
        });
        break;

      case 'Internal Server Error':
        this.toasts.push({
          title: 'Erro inesperado...',
          description: error.response.data.Message,
          type: 'error',
        });
        break;

      default:
        break;
    }
  }
}

interface ApiErrorHandler {
  handleException: (
    exception: ApiError,
    formRef?: React.MutableRefObject<FormHandles>,
  ) => void;
}

export function useApiErrorHandler(): ApiErrorHandler {
  const { addToast } = useToast();

  const handleException = useCallback(
    (exception: ApiError, formRef = null) => {
      if (exception.toasts.length)
        exception.toasts.forEach(toast => addToast(toast));

      if (!!exception.formErrors && formRef)
        formRef.current.setErrors(exception.formErrors);
    },
    [addToast],
  );

  return { handleException };
}
