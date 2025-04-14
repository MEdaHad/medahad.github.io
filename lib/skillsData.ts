import { IconType } from 'react-icons';
import { FaShieldAlt, FaCode, FaServer, FaLock, FaBug, FaNetworkWired, FaTerminal, FaDatabase } from 'react-icons/fa';
import { HiCloud, HiLockClosed } from 'react-icons/hi';
import { SiKalilinux, SiWireshark } from 'react-icons/si';

export interface Skill {
  name: string;
  level: number; // 0-100
  icon?: IconType;
  codeSnippet?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: IconType;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'security-assessment',
    name: 'Security Assessment',
    icon: FaShieldAlt,
    skills: [
      {
        name: 'Penetration Testing',
        level: 95,
        icon: SiKalilinux,
        codeSnippet: `def scan_vulnerabilities(target):\n  nmap_results = subprocess.run([\"nmap\", \"-sV\", \"-p-\", target])\n  return parse_vulnerabilities(nmap_results.stdout)`
      },
      {
        name: 'Vulnerability Assessment',
        level: 92,
        icon: FaBug,
        codeSnippet: `async function scanNetwork(subnet) {\n  const hosts = await discovery.findHosts(subnet);\n  return hosts.map(host => vulnerability.assessDevice(host));\n}`
      },
      {
        name: 'Security Auditing',
        level: 88,
        icon: FaLock,
        codeSnippet: `function auditCompliance(systems, standard) {\n  return systems.map(sys => {\n    return {\n      system: sys.name,\n      compliant: checkCompliance(sys, standard),\n      findings: getFindings(sys, standard)\n    };\n  });\n}`
      }
    ]
  },
  {
    id: 'secure-development',
    name: 'Secure Development',
    icon: FaCode,
    skills: [
      {
        name: 'Secure Coding',
        level: 90,
        icon: FaLock,
        codeSnippet: `function sanitizeInput(input) {\n  // Prevent SQL injection\n  return input.replace(/[\\0\\x08\\x09\\x1a\\n\\r\"\'\\\\%]/g, function (char) {\n    switch (char) {\n      case \"\\0\": return \"\\\\0\";\n      case \"\\n\": return \"\\\\n\";\n      case \"\\r\": return \"\\\\r\";\n      default: return \"\\\\\"+char;\n    }\n  });\n}`
      },
      {
        name: 'SAST & DAST',
        level: 87,
        icon: FaBug,
        codeSnippet: `const scanCodebase = (repo) => {\n  return {\n    staticAnalysis: runSASTScan(repo),\n    secretsDetection: findSecrets(repo),\n    vulnerableDependencies: checkDependencies(repo)\n  };\n};`
      },
      {
        name: 'DevSecOps',
        level: 89,
        icon: FaTerminal
      }
    ]
  },
  {
    id: 'network-security',
    name: 'Network Security',
    icon: FaNetworkWired,
    skills: [
      {
        name: 'Packet Analysis',
        level: 96,
        icon: SiWireshark,
        codeSnippet: `async function detectAnomalies(pcap) {\n  const packets = await parsePcap(pcap);\n  const flows = buildNetworkFlows(packets);\n  return detectThreatPatterns(flows, knownSignatures);\n};`
      },
      {
        name: 'Firewall Management',
        level: 94,
        icon: FaShieldAlt
      },
      {
        name: 'IDS/IPS Configuration',
        level: 92,
        icon: FaLock
      }
    ]
  },
  {
    id: 'infrastructure',
    name: 'Cloud Security',
    icon: HiCloud,
    skills: [
      {
        name: 'AWS Security',
        level: 91,
        icon: FaServer,
        codeSnippet: `// AWS S3 bucket security check\nfunction checkS3Buckets() {\n  const vulnerableBuckets = [];\n  const buckets = listAllS3Buckets();\n  \n  for (const bucket of buckets) {\n    if (isPubliclyAccessible(bucket)) {\n      vulnerableBuckets.push(bucket.name);\n    }\n  }\n  return vulnerableBuckets;\n}`
      },
      {
        name: 'Container Security',
        level: 93,
        icon: FaDatabase
      },
      {
        name: 'Security Automation',
        level: 90,
        icon: FaTerminal,
        codeSnippet: `import boto3\n\ndef lambda_handler(event, context):\n    # Automatically remediate exposed security groups\n    ec2 = boto3.client('ec2')\n    security_groups = ec2.describe_security_groups()\n    \n    for sg in security_groups['SecurityGroups']:\n        for rule in sg['IpPermissions']:\n            if has_public_access(rule):\n                revoke_public_access(ec2, sg['GroupId'], rule)\n    \n    return { 'remediated_groups': len(security_groups) }`
      }
    ]
  }
]; 