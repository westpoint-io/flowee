import json

# Define the classification of resources into tiers with more comprehensive resource types
tiers = {
    'Storage': ['S3::Bucket'],
    'ETL': ['StepFunctions::StateMachine'],
    'Database': ['DynamoDB::Table', 'RDS::DBCluster'],
    'Compute': ['EC2::Instance', 'Lambda::Function'],
    "Integration": ['ApiGateway::Method'],
    'Network': [ 'CloudFront::Distribution', 'ApiGateway::RestApi'],
    'Ingress': ['Route53::HostedZone', 'CertificateManager::Certificate'],
}

groups = [tier for tier in tiers]

def group_items_by_property(items, property_name):
    grouped_items = {}
    for item in items:
        property_value = item.get("properties", {}).get(property_name)
        if property_value is not None:
            if property_value not in grouped_items:
                grouped_items[property_value] = []
            grouped_items[property_value].append(item)
    return grouped_items

def group_items_by_property_charset(items, property_name, charset):
    grouped_items = {}
    for item in items:
        property_value = item.get(property_name)
        property_value = property_value[:charset]
        if property_value is not None:
            if property_value not in grouped_items:
                grouped_items[property_value] = []
            grouped_items[property_value].append(item)
    return grouped_items

def get_resource_name(resource):
    type = resource['Type']
    try:
        if type == 'AWS::S3::Bucket':
            return resource['Properties']['BucketName']
        elif type == 'AWS::CertificateManager::Certificate':
            return resource['Properties']['DomainName']
        elif type == 'AWS::ApiGateway::Method':
            return resource['Properties']['Integration']["HttpMethod"]
        elif type == 'AWS::DynamoDB::Table':
            return resource['Properties']['TableName']
        elif type == 'AWS::StepFunctions::StateMachine':
            return resource['Properties']['Name']
        elif type == 'AWS::EC2::Instance':
            return resource['Properties']['Tags'][0]['Value']
        elif type == 'AWS::Lambda::Function':
            return resource['Properties']['FunctionName']
        elif type == 'AWS::ApiGateway::RestApi':
            return resource['Properties']['Name']
        elif type == 'AWS::CloudFront::Distribution':
            return resource['Properties']['DistributionConfig']['Aliases'][0]
        elif type == 'AWS::Route53::HostedZone':
            return resource['Properties']['Name']
    except:
        return resource['ResourceId']
    
def sanitize_resources(tier, resource):
    return {
        'id': resource['ResourceId'],
        'name': get_resource_name(resource),
        'type': resource['Type'].split('::')[-1],
        'properties': resource['Properties'],
        'tier': tier
    }

def extract_all_resources_from_tier(tier):
    return [resource for resource in template['Resources'] if any(resource_type in template['Resources'][resource]['Type'] for resource_type in tiers[tier])]

def map_resources_to_actual_resource(id, template):
    template['Resources'][id]['ResourceId'] = id
    return template['Resources'][id]

with open('/home/dario/flowee/example/cdk.out/ExamplesStack.template.json') as f:
# with open('template.json') as f:
    cloudformation_json = f.read()

    template = json.loads(cloudformation_json)

    # Initialize a dictionary to hold the classification
    classified_resources = {tier: extract_all_resources_from_tier(tier) for tier in tiers}
    classified_resources = {tier: [map_resources_to_actual_resource(resource, template) for resource in classified_resources[tier]] for tier in tiers}
    edges = []
    all_nodes = []
    # Iterate over the resources in the template
    for tier in classified_resources:
        for resource in classified_resources[tier]:
            resource = sanitize_resources(tier, resource)
            all_nodes.append(resource)
    
    # Sanitize all resources
    for tier in classified_resources:
        classified_resources[tier] = [sanitize_resources(tier, resource) for resource in classified_resources[tier]]

    # print(all_nodes)
    def deep_comparison(value, resource):
        occurrences = []
        if resource == None:
            return []
        if isinstance(value, str):
            if resource in value:
                occurrences.append(value)
        elif isinstance(value, dict):
            for k, v in value.items():
                occurrences.extend(deep_comparison(v, resource))
        elif isinstance(value, list):
            for item in value:
                occurrences.extend(deep_comparison(item, resource))
        
        return occurrences

    for tier in classified_resources:
        for resource in classified_resources[tier]:
            id = resource['id']
            name = resource['name']
            resource_tier = resource['tier']
            for node in all_nodes:
                comparison = deep_comparison(node['properties'], id)
                comparison2 = deep_comparison(node['properties'], name)

                if len(comparison) > 0 or len(comparison2) > 0:
                    if id != node['id']:
                        if (
                            (resource_tier == 'Network' and node['tier'] == 'Integration')
                            or ( resource_tier == 'Integration' and node['tier'] == 'Compute')
                            or (resource_tier == 'Compute' and node['tier'] == 'Database')
                            or (resource_tier == 'Ingress' and node['tier'] == 'Network')
                        ):
                            edges.append({
                                'source': node['id'],
                                'target': id
                            })
                        elif (
                            (resource_tier == 'Network' and node['tier'] == 'Ingress')
                            or (resource_tier == 'Integration' and node['tier'] == 'Network')
                            or (resource_tier == 'Compute' and node['tier'] == 'Integration')
                            or (resource_tier == 'Database' and node['tier'] == 'Compute')
                        ):
                            edges.append({
                                'source': id,
                                'target': node['id']
                            })
                       
    # classified_resources['Integration'] = 

    grouped_resources_integration = group_items_by_property(classified_resources['Integration'], 'HttpMethod')
    new_grouped_resources_integration = []
    for k, v in grouped_resources_integration.items():
        for resource in v:
            resource['group'] = k
            new_grouped_resources_integration.append(resource)
    
    classified_resources['Integration'] = new_grouped_resources_integration

    grouped_resources_compute = group_items_by_property_charset(classified_resources['Compute'], 'name', 3)

    new_grouped_resources_compute = []
    for k, v in grouped_resources_compute.items():
        for resource in v:
            resource['group'] = k
            new_grouped_resources_compute.append(resource)


    result = {
        "Items": classified_resources,
        "Edges": edges
    }

    with open('web/src/test.json', 'w') as f:
        json.dump(result, f, indent=4)


            
