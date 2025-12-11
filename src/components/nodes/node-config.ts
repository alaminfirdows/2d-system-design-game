import { Position } from '@xyflow/react';

// Import icons
import awsApiGateway from '@/components/icons/aws-api-gateway.svg';
import awsCloudfront from '@/components/icons/aws-cloudfront.svg';
import awsEc2 from '@/components/icons/aws-ec2.svg';
import awsElasticCache from '@/components/icons/aws-elastic-cache.svg';
import awsLb from '@/components/icons/aws-lb.svg';
import awsRds from '@/components/icons/aws-rds.svg';
import awsS3 from '@/components/icons/aws-s3.svg';
import awsSqs from '@/components/icons/aws-sqs.svg';
import awsWaf from '@/components/icons/aws-waf.svg';

// Node type identifiers
export const NODE_TYPES = {
    LOAD_BALANCER: 'loadbalancer',
    COMPUTE: 'compute',
    DATABASE: 'database',
    CACHE: 'cache',
    QUEUE: 'queue',
    STORAGE: 'storage',
    FIREWALL: 'firewall',
    CDN: 'cdn',
    API_GATEWAY: 'apigateway',
} as const;

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

// Node configuration interface
export interface NodeConfig {
    type: NodeType;
    label: string;
    shortLabel?: string;
    icon: string;
    iconClassNames: string;
    allowedIncoming: NodeType[];
    allowedOutgoing: NodeType[];
    handles: {
        in: Position;
        out: Position;
    };
}

const {
    LOAD_BALANCER,
    COMPUTE,
    DATABASE,
    CACHE,
    QUEUE,
    STORAGE,
    FIREWALL,
    CDN,
    API_GATEWAY,
} = NODE_TYPES;

// Node configurations
export const nodeConfigs: Record<NodeType, NodeConfig> = {
    [LOAD_BALANCER]: {
        type: LOAD_BALANCER,
        label: 'Load Balancer',
        shortLabel: 'LB',
        icon: awsLb,
        iconClassNames: 'bg-purple-900',
        allowedIncoming: [API_GATEWAY, CDN, FIREWALL],
        allowedOutgoing: [COMPUTE],
        handles: {
            in: Position.Top,
            out: Position.Bottom,
        },
    },
    [COMPUTE]: {
        type: COMPUTE,
        label: 'Compute',
        shortLabel: 'Compute',
        icon: awsEc2,
        iconClassNames: 'bg-orange-700',
        allowedIncoming: [LOAD_BALANCER, API_GATEWAY, QUEUE],
        allowedOutgoing: [DATABASE, CACHE, QUEUE, STORAGE],
        handles: {
            in: Position.Top,
            out: Position.Bottom,
        },
    },
    [DATABASE]: {
        type: DATABASE,
        label: 'Database',
        shortLabel: 'DB',
        icon: awsRds,
        iconClassNames: 'bg-blue-700',
        allowedIncoming: [COMPUTE, CACHE],
        allowedOutgoing: [COMPUTE],
        handles: {
            in: Position.Top,
            out: Position.Bottom,
        },
    },
    [CACHE]: {
        type: CACHE,
        label: 'Cache',
        shortLabel: 'Cache',
        icon: awsElasticCache,
        iconClassNames: 'bg-blue-700',
        allowedIncoming: [COMPUTE],
        allowedOutgoing: [COMPUTE, DATABASE],
        handles: {
            in: Position.Top,
            out: Position.Bottom,
        },
    },
    [QUEUE]: {
        type: QUEUE,
        label: 'Queue',
        shortLabel: 'Queue',
        icon: awsSqs,
        iconClassNames: 'bg-rose-500',
        allowedIncoming: [COMPUTE, API_GATEWAY],
        allowedOutgoing: [COMPUTE],
        handles: {
            in: Position.Top,
            out: Position.Bottom,
        },
    },
    [STORAGE]: {
        type: STORAGE,
        label: 'Storage',
        shortLabel: 'Storage',
        icon: awsS3,
        iconClassNames: 'bg-green-700',
        allowedIncoming: [COMPUTE, CDN],
        allowedOutgoing: [COMPUTE, CDN],
        handles: {
            in: Position.Top,
            out: Position.Bottom,
        },
    },
    [FIREWALL]: {
        type: FIREWALL,
        label: 'Firewall',
        shortLabel: 'FW',
        icon: awsWaf,
        iconClassNames: 'bg-red-500',
        allowedIncoming: [],
        allowedOutgoing: [LOAD_BALANCER, API_GATEWAY, CDN],
        handles: {
            in: Position.Top,
            out: Position.Bottom,
        },
    },
    [CDN]: {
        type: CDN,
        label: 'CDN',
        shortLabel: 'CDN',
        icon: awsCloudfront,
        iconClassNames: 'bg-purple-700',
        allowedIncoming: [FIREWALL, STORAGE],
        allowedOutgoing: [LOAD_BALANCER, STORAGE],
        handles: {
            in: Position.Top,
            out: Position.Bottom,
        },
    },
    [API_GATEWAY]: {
        type: API_GATEWAY,
        label: 'API Gateway',
        shortLabel: 'Gateway',
        icon: awsApiGateway,
        iconClassNames: 'bg-rose-700',
        allowedIncoming: [FIREWALL],
        allowedOutgoing: [LOAD_BALANCER, COMPUTE, QUEUE],
        handles: {
            in: Position.Top,
            out: Position.Bottom,
        },
    },
};

export const nodeTypeList = Object.keys(nodeConfigs) as NodeType[];
