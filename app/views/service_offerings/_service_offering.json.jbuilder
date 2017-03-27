json.extract! service, :id, :thing_id, :name, :description, :created_at, :updated_at
json.thing_name service.thing.name if service.thing.respond_to?(:name)
json.user_roles service.user_roles unless service.user_roles.empty?