export interface IContainer {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  Ports: [];
  Labels: [];
  State: string;
  Status: string;
  HostConfig: {
    NetworkMode: string;
  };
  NetworkSettings: {
    Network: {
      MacAddress: string;
      Gateaway: string;
      IPAddress: string;
    };
  };
  Mounts: [];
}
