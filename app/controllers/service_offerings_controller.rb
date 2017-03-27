class ServiceOfferingsController < ApplicationController
  before_action :set_thing, only: :create
  before_action :set_service_offering, except: [:index, :create]
  before_action :authenticate_user!, only: [:create, :update, :destroy]

	def index
		authorize ServiceOffering
		@service_offerings = policy_scope(ServiceOffering.all)
		@service_offerings = ServiceOfferingPolicy.merge(@service_offerings)
	end

	def create
		authorize ServiceOffering
		@service = ServiceOffering.new(service_offering_params)
		@service.creator_id = current_user.id

		User.transaction do
			if @service.save
				role=current_user.add_role(Role::ORGANIZER, @service)
				@service.user_roles << role.role_name
				role.save!
				render :show, status: :created, location: @service
			else
				render json: {errors:@service.errors.messages}, status: :unprocessable_entity
			end
		end
	end

	def show
		authorize @service_offering
		service = policy_scope(ServiceOffering.where(:id=>@service_offering.id))
		@service = ServiceOfferingPolicy.merge(service).first
	end

	def update
		@service_offering.update_attributes(service_offering_params)
	end

	def destroy
		@service_offering.destroy
	end

  def linkable_things
	  # authorize Thing, :get_linkables?
		p params
	  service_offering = Image.find(params[:service_offerings_id])
	  @things = Thing.not_linked_se(service_offering)
	  # @things=ThingPolicy::Scope.new(current_user,@things).user_roles(true,false)
	  # @things=ThingPolicy.merge(@things)
	  render "things/index"
  end

  private

	def set_thing
		@thing = Thing.find_by_id(params[:thing_id])
	end

	def set_service_offering
		@service_offering = ServiceOffering.find_by_id(params[:id])
	end

	def service_offering_params
		params.require(:service_offering).tap {|p|
			p.require(:name) #throws ActionController::ParameterMissing
		}.permit(:name, :description)
	end
end